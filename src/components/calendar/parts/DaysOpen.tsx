// components/Days.tsx

import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import { OpenDayList } from '@/lib/date';

export type StudentClassInfo = {
  standardClass: string;
  standardDay: string;
};

type Props = {
  year: number;
  month: number;
  handleCloseModal?: () => void;
};

const DaysOpen = (props: Props) => {
  const { year, month } = props;
  const [openDaysObjList, setOpenDaysObjList] = useState<OpenDayList[]>([]);

  // ローディング状態管理用
  const [loading, setLoading] = useState<boolean>(true);

  const today = dayjs();
  const firstDayOfMonth = dayjs(new Date(year, month - 1, 1));
  const startDay = firstDayOfMonth.day();
  const daysInMonth = firstDayOfMonth.daysInMonth();

  const collectionNameInMemo = useMemo(() => `openDay_${year}_${month}`, [year, month]);

  // 開校日を月ごとにfetchする関数
  const getOpenDayInfo = async () => {
    try {
      setLoading(true); // フェッチ前にローディング状態をtrueにする
      const response = await axios.get('/api/booking/fetchOpenDays', {
        params: { collectionName: collectionNameInMemo },
      });
      setOpenDaysObjList(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // フェッチ完了後(成功/失敗問わず)ローディング状態をfalseにする
    }
  };

  useEffect(() => {
    getOpenDayInfo();
  }, [year, month]);

  // days配列を作成する
  const days = [];
  for (let day = 0; day < startDay; day++) {
    days.push(
      <div key={`empty-${day}`} className="border-b border-r border-black bg-gray-300"></div>,
    );
  }

  const handleNavigateLoginPage = () => {
    if (!confirm('予約変更にはログインが必要です。ログインしますか？')) {
      return;
    }
    window.open('/signin?redirectTo=%2Fbooking'); // サインイン後に予約ページへリダイレクト
  };

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDay = dayjs(new Date(year, month - 1, day));
    const isPast = currentDay.isBefore(today, 'day');

    // openDaysObjListの中にdayが含まれているかどうかを確認する
    const openDayList = openDaysObjList?.filter((d: OpenDayList) => Number(d.date) === day);

    // dayが開校日に含まれていればtrueになる
    const isOpenDay = openDayList.length > 0;

    days.push(
      <div
        key={day}
        className={`flex h-24 justify-center border-b border-r border-black py-4 text-center ${
          isPast ? 'bg-gray-200' : ''
        }`}
      >
        {!isPast && isOpenDay ? (
          <div>
            <ButtonOriginal
              variant="secondary"
              onClick={handleNavigateLoginPage}
              label={String(day)}
              loading={loading}
            />
          </div>
        ) : (
          <div>
            <div>{day}</div>
          </div>
        )}
      </div>,
    );
  }

  return (
    <div>
      <div className="grid grid-cols-7 border-l border-t border-black">{days}</div>
    </div>
  );
};

export default DaysOpen;
