// components/Days.tsx

import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import { CLASS_NAME } from '@/lib/classInfo';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { IoReloadCircleOutline } from 'react-icons/io5';

import axios from 'axios';
import { SeatMapData } from '@/types/seatMap';
import { useToast } from '@chakra-ui/react';

type DaysProps = {
  year: number;
  month: number;
  setOpenDay: (day: number) => void;
};

type DataObj = {
  date: number;
  dayOfWeek: string;
  remainingSeatClass1: number;
  remainingSeatClass2: number;
  remainingSeatClass3: number;
  remainingSeatClass4: number;
  remainingSeatClass5: number;
  remainingSeatClass6: number;
  remainingSeatClass7: number;
};

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DaysToSetOpen = ({ year, month, setOpenDay }: DaysProps) => {
  const [openDaysObjList, setOpenDaysObjList] = useState([]);
  const today = dayjs();
  const firstDayOfMonth = dayjs(new Date(year, month - 1, 1));
  const startDay = firstDayOfMonth.day();
  const daysInMonth = firstDayOfMonth.daysInMonth();
  const [seatMap, setSeatMap] = useState<SeatMapData[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchSeatMapData = async () => {
      try {
        const response = await fetch('/api/seatMap/fetchStandard');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: SeatMapData[] = await response.json();
        setSeatMap(data);
      } catch (err) {
        console.error('Error fetching seat map:', err);
      }
    };

    fetchSeatMapData();
  }, []);

  const handleAddOpenDate = async (day: number) => {
    if (seatMap.length === 0) {
      alert('まだseatMapがfetchできてません。');
      return;
    }
    //if (!confirm('開校日を追加しますか?')) return;

    const collectionName = 'openDay_' + year + '_' + month;
    const date = new Date(year, month - 1, day);
    const dayOfWeek = daysOfWeek[date.getDay()];

    const dataObj: any = { date: day, dayOfWeek };

    dataObj.class1 = seatMap[dataObj.dayOfWeek === 'Sat' ? 0 : 1].data.class1;
    dataObj.class2 = seatMap[dataObj.dayOfWeek === 'Sat' ? 0 : 1].data.class2;
    dataObj.class3 = seatMap[dataObj.dayOfWeek === 'Sat' ? 0 : 1].data.class3;
    dataObj.class4 = seatMap[dataObj.dayOfWeek === 'Sat' ? 0 : 1].data.class4;
    dataObj.class5 = seatMap[dataObj.dayOfWeek === 'Sat' ? 0 : 1].data.class5;

    try {
      const response = await fetch('/api/booking/addOpenDays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionName, ...dataObj }),
      });
      if (response.ok) {
        toast({
          title: '成功',
          status: 'success',
          position: 'top-right',
        });
      } else {
        toast({
          title: '失敗',
          status: 'error',
          position: 'top-right',
        });
      }
    } catch (error) {
      console.error('Error adding open day:', error);
    } finally {
      getOpenDayInfo();
    }
  };

  const handleDeleteOpenDate = async (day: number) => {
    // confirm('開校日を削除しますか?');
    const collectionName: String = 'openDay_' + year + '_' + month;

    try {
      const response = await fetch('/api/booking/deleteOpenDays', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionName: collectionName,
          fieldName: 'date',
          fieldValue: day,
        }),
      });
    } catch (e) {
      console.log(e);
    } finally {
      getOpenDayInfo();
    }
  };

  // 開校日を月ごとにfetchする関数
  const getOpenDayInfo = async () => {
    const collectionName: String = 'openDay_' + year + '_' + month;
    try {
      const response = await axios.get('/api/booking/fetchOpenDays', {
        params: { collectionName },
      });

      setOpenDaysObjList(response.data);
      // console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setOpenDaysObjList([]);
    getOpenDayInfo();
  }, [year, month]);

  const days = [];
  for (let day = 0; day < startDay; day++) {
    days.push(
      <div key={`empty-${day}`} className="border-b border-r border-black bg-gray-300 py-12"></div>,
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDay = dayjs(new Date(year, month - 1, day));
    const isPast = currentDay.isBefore(today, 'day');

    // openDaysListの中にiが含まれているかどうかを確認する
    const isOpenDayList = openDaysObjList?.filter((d: any) => Number(d?.date) === Number(day));

    // dayが開校日に含まれていれば、trueになる
    const isOpenDay = isOpenDayList.length > 0;
    days.push(
      <div
        key={day}
        className={`flex h-24 justify-center border-b border-r border-black py-4 text-center ${
          isPast ? 'bg-gray-200' : ''
        }`}
      >
        {isOpenDay ? (
          <ButtonOriginal
            variant="primary"
            onClick={() => handleDeleteOpenDate(day)}
            label={String(day)}
            className=""
          />
        ) : (
          <ButtonOriginal
            variant="secondary"
            onClick={() => handleAddOpenDate(day)}
            label={String(day)}
            className=""
          />
        )}
      </div>,
    );
  }

  return (
    <div className="grid grid-cols-7 border-l border-t border-black">
      {days}
      <ButtonOriginal
        variant="primary"
        Icon={IoReloadCircleOutline}
        label="日時取得"
        onClick={getOpenDayInfo}
      />
    </div>
  );
};

export default DaysToSetOpen;
