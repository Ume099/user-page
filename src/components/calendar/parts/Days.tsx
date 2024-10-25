// components/Days.tsx
import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import { bookingChangeState } from '@/hooks/atom/bookingChange';
import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { getClassListFormatted, getDayOfWeekEng } from '@/lib/date';
import { getDateByUID } from '@/lib/SeatMap';
import { BookedClassInfoListObj, packBookedClassInfo } from '@/lib/userSettings';
import axios from 'axios';
import dayjs from 'dayjs';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify'; // 変更
import { useRecoilState } from 'recoil';
import ClassSelectModalModal from './ClassSelectModal';

export type StudentClassInfo = {
  standardClass: string;
  standardDay: string;
};

type Props = {
  year: number;
  month: number;
  handleCloseModal?: () => void;
};

const Days = (props: Props) => {
  const { year, month } = props;
  const [openDaysObjList, setOpenDaysObjList] = useState<any[]>([]);
  const today = dayjs();
  const firstDayOfMonth = dayjs(new Date(year, month - 1, 1));
  const startDay = firstDayOfMonth.day();
  const daysInMonth = firstDayOfMonth.daysInMonth();
  const [isOpenSetClassModal, setIsOpenSetClassModal] = useState(false);
  const [DAY, setDAY] = useState(0);
  const [classList, setClassList] = useState<any[]>([]);
  const [bookedDay, setBookedDay] = useState<number[]>([]);

  // Recoilのステートを取得
  const [bookingChange] = useRecoilState(bookingChangeState);
  const [userInfo] = useRecoilState<UserInfo>(userInfoState);
  const [bookedClassInfoListObj, setBookedClassInfoListObj] = useState<BookedClassInfoListObj>();

  const collectionNameInMemo = useMemo(() => 'openDay_' + year + '_' + month, [year, month]);

  // 開校日を月ごとにfetchする関数
  const getOpenDayInfo = async () => {
    try {
      const response: any = await axios.get('/api/booking/fetchOpenDays', {
        params: { collectionName: collectionNameInMemo },
      });
      const itemList: SetStateAction<any[]> = [];
      response.data.forEach((data: any) => itemList.push(data._fieldsProto));
      setOpenDaysObjList(itemList);
    } catch (error) {
      console.log(error);
    }
  };

  // キャンセルするクラスを選択するモーダルを開く関数
  const handleOpenSetClassModal = (day: number) => {
    setDAY(day);
    setIsOpenSetClassModal((prev) => !prev);
  };

  const checkIsBefChangeExists = () => {
    return (
      bookingChange.yearBefChange &&
      bookingChange.monthBefChange &&
      bookingChange.dayBefChange &&
      bookingChange.classBefChange
    );
  };

  const checkIsSetAsBefChange = (day: number): boolean => {
    return (
      bookingChange.yearBefChange === year &&
      bookingChange.monthBefChange === month &&
      bookingChange.dayBefChange === day
    );
  };

  const checkIsSetAsAftChange = (day: number): boolean => {
    return (
      bookingChange.yearAftChange === year &&
      bookingChange.monthAftChange === month &&
      bookingChange.dayAftChange === day
    );
  };

  const unableOpenToast = () => {
    toast.error('予約を変更するには、先に変更元の日時を選択してください。');
  };

  const getClassList = async (year: number, month: number, date: number) => {
    const dayOfWeek = getDayOfWeekEng(year, month, date);
    try {
      const response: any = await axios.get('api/fetchFireStore', {
        params: { collectionName: 'classes', docId: dayOfWeek },
      });
      const res = getClassListFormatted(response.data);
      setClassList(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllDocs = async () => {
    try {
      const response: any = await axios.get('/api/fetchCollection', {
        params: { collectionName: collectionNameInMemo },
      });
      const array = getDateByUID(response.data, userInfo.uid);
      setBookedDay(array);
    } catch (error) {
      console.log(error);
    }
  };

  const getBookedClassInfo = async (day: number) => {
    if (!collectionNameInMemo) return;
    try {
      const response: any = await axios.get('api/booking/fetchBookedClassInfo', {
        params: { collectionName: collectionNameInMemo, docId: 'day_' + day, uid: userInfo.uid },
      });
      const resObj: any = response;
      const obj = packBookedClassInfo(resObj.data._fieldsProto);
      setBookedClassInfoListObj(obj);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setOpenDaysObjList([]);
    getOpenDayInfo();
    getAllDocs();
  }, [year, month]);

  useEffect(() => {
    getClassList(year, month, DAY);
    getBookedClassInfo(DAY);
  }, [DAY]);

  const checkIsAftChangeExists = (): boolean => {
    return !!(
      bookingChange.yearAftChange &&
      bookingChange.monthAftChange &&
      bookingChange.dayAftChange &&
      bookingChange.classAftChange
    );
  };

  const days = [];
  for (let day = 0; day < startDay; day++) {
    days.push(
      <div key={`empty-${day}`} className="border-b border-r border-black bg-gray-300"></div>,
    );
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDay = dayjs(new Date(year, month - 1, day));
    const isPast = currentDay.isBefore(today, 'day');

    const openDayList = openDaysObjList?.filter(
      (d: any) => Number(d?.date?.integerValue) === Number(day),
    );
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
              variant={
                checkIsSetAsAftChange(day) || bookedDay.includes(day)
                  ? checkIsSetAsAftChange(day) || !checkIsSetAsBefChange(day)
                    ? 'primary'
                    : 'secondary'
                  : checkIsSetAsAftChange(day)
                    ? 'primary'
                    : 'secondary'
              }
              onClick={
                checkIsSetAsAftChange(day) || bookedDay.includes(day) || checkIsBefChangeExists()
                  ? () => handleOpenSetClassModal(day)
                  : () => unableOpenToast()
              }
              label={String(day)}
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
      {isOpenSetClassModal && (
        <div className="flex flex-col">
          <div className="fixed top-28 z-30 mx-auto mb-4 lg:left-40">
            <ButtonOriginal
              variant="error-secondary"
              label="×"
              className="!flex !items-center !rounded-full !text-center text-4xl"
              onClick={() => setIsOpenSetClassModal((prev) => !prev)}
            />
          </div>

          <ClassSelectModalModal
            year={year}
            month={month}
            day={DAY}
            CLASS_LIST={classList}
            bookedClassInfoListObj={bookedClassInfoListObj}
            uid={userInfo.uid}
          />
        </div>
      )}
    </div>
  );
};

export default Days;
