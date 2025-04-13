import CalenderToSetOpen from '@/components/calendar/CalenderToSetOpen';
import Button from '@/components/common/parts/Button';
import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import CalendarButton from '@/components/calendar/parts/CalendarButton';

import { AuthGuard } from '@/feature/auth/component/AuthGuard/AuthGuard';
import { AuthLimited } from '@/feature/auth/component/AuthGuard/AuthLimited';
import { useState } from 'react';
import { GoTriangleDown } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';

const MONTH_NAME: string[] = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
];

const date = new Date();
const currentMonth = date.getMonth();
const currentYear = date.getFullYear();

export default function setOpenDays() {
  const [isOpenSetmonthAndYearOnDisplayModal, setIsOpenSetmonthAndYearOnDisplayModal] =
    useState(false);
  const [yearOnDisplay, setYearOnDisplay] = useState<number>(currentYear);
  const [errorYear, setErrorYear] = useState('');
  const [errorMonth, setErrorMonth] = useState('');
  const [monthOnDisplay, setmonthOnDisplay] = useState(currentMonth + 1);

  // 編集する月を設定する関数
  const setMonth = (num: number) => {
    setmonthOnDisplay(num);
    if (yearOnDisplay === currentYear && num - 1 < currentMonth) {
      setErrorMonth('過去の情報は取得できません。');
      setIsOpenSetmonthAndYearOnDisplayModal(false);
      return; //何もしない
    } else if (yearOnDisplay < currentYear) {
      setErrorMonth('過去の情報は取得できません。');
      setIsOpenSetmonthAndYearOnDisplayModal(false);
      return; //何もしない
    }
    setErrorMonth('');
    setIsOpenSetmonthAndYearOnDisplayModal(false);
  };

  // 月and年変更モーダルで年を増加させる関数
  const setYearIncremented = () => {
    if (yearOnDisplay + 1 >= currentYear) {
      setErrorYear('');
    }
    setYearOnDisplay((prev) => prev + 1);
  };

  // 月and年変更モーダルで年を減少させる関数
  const setYearDecremented = () => {
    if (yearOnDisplay === currentYear) {
      setErrorYear('過去の情報は取得できません。');
    } else if (yearOnDisplay === currentYear || monthOnDisplay === currentMonth) {
      setErrorMonth('過去の情報は取得できません。');
    }
    setYearOnDisplay((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    if (monthOnDisplay === 12) {
      setmonthOnDisplay(1);
      setYearOnDisplay((prev) => prev + 1);
    } else {
      setmonthOnDisplay((prev) => prev + 1);
    }
    setErrorMonth('');
  };

  const handlePrevMonth = () => {
    if (yearOnDisplay === currentYear && monthOnDisplay === currentMonth + 1) {
      setErrorMonth('過去の情報は取得できません。');
      return;
    }

    if (monthOnDisplay === 1) {
      setmonthOnDisplay(12);
      setYearOnDisplay((prev) => prev - 1);
    } else {
      setmonthOnDisplay((prev) => prev - 1);
    }
    setErrorMonth('');
  };

  return (
    <AuthLimited>
      <div>
        {/* カレンダー本体 */}
        <div className="flex w-1/2 justify-center">
          <div className="z-10 rounded-lg bg-white py-4 text-center">
            <div className="flex items-center justify-center  gap-x-10">
              <ButtonOriginal
                onClick={() => handlePrevMonth()}
                label="◀"
                className="border-none text-4xl"
              />
              <div className="text-4xl">{yearOnDisplay}年</div>
              <div className="text-4xl">{monthOnDisplay}月</div>
              <ButtonOriginal
                onClick={() => handleNextMonth()}
                label="▶"
                className="border-none text-4xl"
              />
            </div>
            <div className="mt-2 min-h-8 text-red-600">{errorYear}</div>
          </div>
        </div>
        <div className="">
          <div className="mt-2 flex justify-center text-red-500">{errorMonth}</div>
          <CalenderToSetOpen year={yearOnDisplay} month={monthOnDisplay} />
        </div>
      </div>
    </AuthLimited>
  );
}
