import BookingInfoBefChg from '@/components/calendar/BookingInfoBefChg';
import Calendar from '@/components/calendar/Calendar';
import ButtonOriginal from '@/components/common/parts/ButtonOriginal';

import { AuthGuard } from '@/feature/auth/component/AuthGuard/AuthGuard';
import { bookingChangeState } from '@/hooks/atom/bookingChange';
import { bookingChangeInfoState, BookingChangeInfoState } from '@/hooks/atom/bookingChangeInfo';
import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { getClassName } from '@/lib/SeatMap';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getUserEmail } from '@/lib/util/firebase/getUserEmail';
import { FirebaseError } from 'firebase/app';
import { BookingChangeMailParam } from '@/lib/type/booking';
import InfoMessage from '@/components/common/parts/InfoMessage';
import { isPast10PMOfPreviousDay } from '@/lib/util/booking/booking';

const date = new Date();
const currentMonth = date.getMonth();
const currentYear = date.getFullYear();

export default function Booking() {
  const [yearOnDisplay, setYearOnDisplay] = useState<number>(currentYear);
  const [monthOnDisplay, setmonthOnDisplay] = useState(currentMonth + 1);

  const [bookingChange, setBookingChange] = useRecoilState(bookingChangeState);

  const [userInfo] = useRecoilState<UserInfo>(userInfoState);

  const [bookingChangeInfo, setBookingChangeInfo] =
    useRecoilState<BookingChangeInfoState>(bookingChangeInfoState);

  const [isSaveButtonLoading, setIsSaveButtonLoading] = useState(false);

  // 編集する月を設定する関数
  const handleSetMonth = (dir: '+' | '-') => {
    setmonthOnDisplay((prevMonth) => {
      let newMonth = prevMonth;
      let newYear = yearOnDisplay;

      if (dir === '+') {
        if (prevMonth === 12) {
          newMonth = 1;
          newYear = yearOnDisplay + 1;
        } else {
          newMonth = prevMonth + 1;
        }
      } else {
        if (prevMonth === 1) {
          newMonth = 12;
          newYear = yearOnDisplay - 1;
        } else {
          newMonth = prevMonth - 1;
        }

        if (newYear < currentYear || (newYear === currentYear && newMonth < currentMonth + 1)) {
          toast({
            title: '過去の予定は取得できません。',
            position: 'top-right',
            status: 'warning',
          });
          return prevMonth;
        }
      }

      if (newYear !== yearOnDisplay) {
        setYearOnDisplay(newYear);
      }

      return newMonth;
    });
  };

  // 変更元の授業が設定されているかを確認する関数
  const checkIsClassBefChangeExists = () => {
    return (
      bookingChange.yearBefChange &&
      bookingChange.monthBefChange &&
      bookingChange.dayBefChange &&
      bookingChange.classBefChange
    );
  };

  // 変更先の授業が設定されているかを確認する関数
  const checkIsClassAftChangeExists = () => {
    return (
      bookingChange.yearAftChange &&
      bookingChange.monthAftChange &&
      bookingChange.dayAftChange &&
      bookingChange.classAftChange
    );
  };

  const clearClassBefChange = async (isFromResetButton: boolean = true) => {
    if (isFromResetButton) {
      const isConfirm = await confirm('保存していない振替をリセットしますか？');

      if (!isConfirm) {
        return; //何もしない
      }
    }
    // リセット用のオブジェクト
    const classInfoDefault = {
      yearBefChange: 0,
      monthBefChange: 0,
      dayBefChange: 0,
      classBefChange: '',
      yearAftChange: 0,
      monthAftChange: 0,
      dayAftChange: 0,
      classAftChange: '',
    };
    setBookingChange(classInfoDefault);
    // classChangeStatus をdefaultにする
    setBookingChangeInfo({
      classChangeInfo: [{ classBefChange: '', classAftChange: '' }],
    });
  };

  // 特定の日の予約状況を取得
  const getBookedClassInfo = async (
    year: number,
    month: number,
    day: number,
    className: string,
  ): Promise<string[]> => {
    console.log({
      year,
      month,
      day,
      className,
    });
    try {
      const response = await axios.get('api/booking/fetchClassStatus', {
        params: {
          collectionName: `openDay_${year}_${month}`,
          docId: 'day_' + day,
          uid: userInfo.uid,
          fieldName: className,
        },
      });
      const ret: string[] = response.data.fieldValue;
      return ret;
    } catch (error) {
      alert(error);
      console.error(error);
      throw error;
    }
  };

  const toast = useToast();

  // 変更情報を更新する
  const handleSaveChange = async () => {
    // 振り替え先の予約状況を判断し、4席なら不可とする
    const aftChangeClass = await getBookedClassInfo(
      bookingChange.yearAftChange,
      bookingChange.monthAftChange,
      bookingChange.dayAftChange,
      getClassName(bookingChange.classAftChange),
    );
    if (aftChangeClass.length >= 4) {
      toast({
        title: '予約先のコマは満席です。別の日時を選択してください。',
        status: 'error',
        position: 'top-right',
      });
      setBookingChange((prev) => ({
        ...prev,
        yearAftChange: 0,
        monthAftChange: 0,
        dayAftChange: 0,
        classAftChange: '',
      }));
      return;
    }

    // 変更前・変更後の予定どちらかが設定されていない
    if (!checkIsClassBefChangeExists() || !checkIsAftChangeInfoExists()) {
      toast({
        title: !checkIsClassAftChangeExists()
          ? !checkIsClassBefChangeExists()
            ? '振替元の曜日を選択して下さい。'
            : '振替先の曜日を選択してください。'
          : '',
        status: 'warning',
        position: 'top-right',
      });
      return;
    }

    // 変更前日10時まで制約
    if (
      isPast10PMOfPreviousDay(
        bookingChange.yearAftChange,
        bookingChange.monthAftChange,
        bookingChange.dayAftChange,
      ) ||
      isPast10PMOfPreviousDay(
        bookingChange.yearBefChange,
        bookingChange.monthBefChange,
        bookingChange.dayBefChange,
      )
    ) {
      toast({
        title: '前日の午後10時を過ぎている予定は変更できません。',
        status: 'error',
        position: 'top-right',
      });
      return;
    }
    let isError: boolean = false;

    setIsSaveButtonLoading(true);
    // AtfChangeを追加
    try {
      await fetch('/api/booking/updateClassChangeInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionName: `openDay_${bookingChange.yearAftChange}_${bookingChange.monthAftChange}`,
          docId: `day_${bookingChange.dayAftChange}`,
          fieldName: getClassName(bookingChange.classAftChange),
          newVal: [...aftChangeClass, userInfo.uid],
        }),
      });
    } catch (e) {
      isError = true;
      console.log(e);
      return;
    }

    if (isError) {
      return;
    }

    const befChangeClass = await getBookedClassInfo(
      bookingChange.yearBefChange,
      bookingChange.monthBefChange,
      bookingChange.dayBefChange,
      getClassName(bookingChange.classBefChange),
    );

    try {
      await fetch('/api/booking/updateClassChangeInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionName: `openDay_${bookingChange.yearBefChange}_${bookingChange.monthBefChange}`,
          docId: `day_${bookingChange.dayBefChange}`,
          fieldName: getClassName(bookingChange.classBefChange),
          newVal: befChangeClass.filter((classInfo) => classInfo !== userInfo.uid),
        }),
      });
    } catch (e) {
      isError = true;
      console.log(e);
      setIsSaveButtonLoading(false);
      return;
    } finally {
      setIsSaveButtonLoading(false);
      clearClassBefChange(false);
    }
    await sendMailToUser();
    await sendMailToAdmin();

    isError = false;
    toast({ title: '座席の変更に成功しました!', position: 'top-right', status: 'success' });
    location.reload();
  };

  const checkIsAftChangeInfoExists = (): boolean => {
    if (!bookingChange.yearAftChange) {
      return false;
    }

    if (!bookingChange.monthAftChange) {
      return false;
    }
    if (!bookingChange.dayAftChange) {
      return false;
    }
    if (!bookingChange.classAftChange) {
      return false;
    }
    return true;
  };

  // 新規追加する変更情報Objを設定
  const handleSetBookingChangeInfo = () => {
    if (!checkIsAftChangeInfoExists()) {
      return;
    }
    // 振替元の情報
    const classBefChange =
      bookingChange.yearBefChange +
      '_' +
      bookingChange.monthBefChange +
      '_' +
      bookingChange.dayBefChange +
      '-' +
      bookingChange.classBefChange;

    // 振替先の情報
    const classAftChange =
      bookingChange.yearAftChange +
      '_' +
      bookingChange.monthAftChange +
      '_' +
      bookingChange.dayAftChange +
      '-' +
      bookingChange.classAftChange;

    const additionalClassChangeInfoObj = {
      classBefChange,
      classAftChange,
    };

    const newClassChangeInfoObj = {
      classChangeInfo: [...(bookingChangeInfo.classChangeInfo || []), additionalClassChangeInfoObj],
    };

    setBookingChangeInfo(newClassChangeInfoObj);
  };

  useEffect(() => {
    return () => {
      handleSetBookingChangeInfo();
    };
    // classAfterChangeが設定されれば、クラス変更情報のオブジェクトがセットされる
  }, [checkIsAftChangeInfoExists()]);

  const sendMailToUser = async () => {
    const sendTo = await getUserEmail(userInfo.uid);
    if (!sendTo) {
      toast({
        title: "エラーが発生しました。missing variant 'sendTo'",
      });
      return;
    }
    const body: BookingChangeMailParam = {
      sendTo: sendTo,
      yearBefChange: bookingChange.yearBefChange,
      monthBefChange: bookingChange.monthBefChange,
      dateBefChange: bookingChange.dayBefChange,
      classBefChange: bookingChange.classBefChange,
      yearAftChange: bookingChange.yearAftChange,
      monthAftChange: bookingChange.monthAftChange,
      dateAftChange: bookingChange.dayAftChange,
      classAftChange: bookingChange.classAftChange,
    };
    console.log(body);
    try {
      const res = await fetch('/api/booking/sendMailToUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (e: any) {
      if (e instanceof FirebaseError) {
        alert(`エラーが発生しました。${e.message}`);
      } else {
        alert(`原因不明のエラーが発生しました。${e.message}`);
      }
    }
  };

  const sendMailToAdmin = async () => {
    const sendTo = await getUserEmail(userInfo.uid);
    console.log(bookingChangeInfo.classChangeInfo);
    if (!sendTo) {
      toast({
        title: "missing variant 'sendTo'",
      });
      return;
    }
    const body: BookingChangeMailParam = {
      sendTo,
      yearBefChange: bookingChange.yearBefChange,
      monthBefChange: bookingChange.monthBefChange,
      dateBefChange: bookingChange.dayBefChange,
      classBefChange: bookingChange.classBefChange,
      yearAftChange: bookingChange.yearAftChange,
      monthAftChange: bookingChange.monthAftChange,
      dateAftChange: bookingChange.dayAftChange,
      classAftChange: bookingChange.classAftChange,
    };
    try {
      const res = await fetch('/api/booking/sendMailToAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...body, name: userInfo.userName }),
      });
    } catch (e: any) {
      if (e instanceof FirebaseError) {
        alert(`エラーが発生しました。${e.message}`);
      } else {
        alert(`原因不明のエラーが発生しました。${e.message}`);
      }
    }
  };

  return (
    <AuthGuard>
      <div className="w-full">
        {/* header message */}
        <div className="mx-auto h-auto">
          <InfoMessage
            message={'ご不明点等ございましたらLINEの方までご連絡ください。'}
            status="info"
          />
        </div>
        <div className="w-full">
          <div className="w-full gap-4">
            <div className="mt-5" />
            <BookingInfoBefChg
              label={
                checkIsClassBefChangeExists()
                  ? `変更前: ${bookingChange.yearBefChange}年 ${bookingChange.monthBefChange}月 ${bookingChange.dayBefChange}日 ${bookingChange.classBefChange}`
                  : ''
              }
            />
            <p className="flex items-center justify-center !text-center"> ↓</p>
            <BookingInfoBefChg
              label={
                checkIsClassAftChangeExists()
                  ? `変更後: ${bookingChange.yearAftChange}年 ${bookingChange.monthAftChange}月 ${bookingChange.dayAftChange}日 ${bookingChange.classAftChange}`
                  : ''
              }
            />
            <div className="mb-4"></div>
            <div className="grid grid-cols-1 gap-y-4">
              <ButtonOriginal
                onClick={() => handleSaveChange()}
                label="保存"
                variant={
                  checkIsClassBefChangeExists() && checkIsAftChangeInfoExists() ? 'primary' : 'gray'
                }
                disabled={isSaveButtonLoading}
              />
              <ButtonOriginal
                onClick={() => clearClassBefChange()}
                label="リセット"
                variant="error-secondary"
              />
            </div>
          </div>
        </div>
        {/* カレンダー本体 */}
        <div className="">
          <div className="mt-[52px] w-full pl-12">
            <p className="ml-10 text-xl">
              {yearOnDisplay}
              <span>年</span>
            </p>
            <div className="flex w-[200px] items-center justify-center space-x-2 rounded-lg p-2 text-xl">
              <button
                onClick={() => handleSetMonth('-')}
                className="h-10 w-10 rounded-lg bg-gray-200 "
              >
                {'<'}
              </button>
              <p className="font-bold">
                {monthOnDisplay}
                <span>月</span>
              </p>
              <button
                onClick={() => handleSetMonth('+')}
                className="h-10 w-10 rounded-lg bg-gray-200"
              >
                {'>'}
              </button>
            </div>
          </div>
          <Calendar year={yearOnDisplay} month={monthOnDisplay} />
        </div>
      </div>
    </AuthGuard>
  );
}
