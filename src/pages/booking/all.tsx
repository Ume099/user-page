import BookingInfoBefChg from '@/components/calendar/BookingInfoBefChg';
import ButtonOriginal from '@/components/common/parts/ButtonOriginal';

import { bookingChangeState } from '@/hooks/atom/bookingChange';
import { bookingChangeInfoState, BookingChangeInfoState } from '@/hooks/atom/bookingChangeInfo';
import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { getClassName } from '@/lib/SeatMap';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import useSWR from 'swr';
import { SubmitHandler, useForm } from 'react-hook-form';
import SelectObj from '@/components/common/parts/SelectObj';
import { AuthLimited } from '@/feature/auth/component/AuthGuard/AuthLimited';
import CalendarAdmin from '@/components/calendar/CalendarAdmin';

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

type UserData = {
  uid: string;
  name?: string;
  email?: string;
  displayName?: string;
};

type InputType = {
  uid: string;
};

// データフェッチ用の fetcher 関数
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Booking() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputType>();

  const [isOpenSetmonthAndYearOnDisplayModal, setIsOpenSetmonthAndYearOnDisplayModal] =
    useState(false);
  const [yearOnDisplay, setYearOnDisplay] = useState<number>(currentYear);
  const [monthOnDisplay, setmonthOnDisplay] = useState(currentMonth + 1);

  const [bookingChange, setBookingChange] = useRecoilState(bookingChangeState);

  const [userInfo] = useRecoilState<UserInfo>(userInfoState);

  const [bookingChangeInfo, setBookingChangeInfo] =
    useRecoilState<BookingChangeInfoState>(bookingChangeInfoState);

  const [befChangeClass, setBefChangeClass] = useState<string[]>(['']);
  const [aftChangeClass, setAftChangeClass] = useState<string[]>(['']);

  const [isSaveButtonLoading, setIsSaveButtonLoading] = useState(false);
  const [uid, setUid] = useState<string>('');
  const { data: users } = useSWR<UserData[]>('/api/userActions/fetchUsers', fetcher);

  const toast = useToast();
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

  // 特定の日の予約状況を取得してaftChangeに設定する関数
  const getBookedClassInfo = async (
    year: number,
    month: number,
    day: number,
    className: string,
    isForAft: boolean,
  ) => {
    try {
      const response = await axios.get('/api/booking/fetchClassStatus', {
        params: {
          collectionName: `openDay_${year}_${month}`,
          docId: 'day_' + day,
          uid,
          fieldName: className,
        },
      });

      const obj: string[] = response.data.fieldValue;
      if (isForAft) {
        setAftChangeClass(obj);
      } else {
        setBefChangeClass(obj);
      }
      console.log('obj', response.data.fieldValue);
    } catch (error) {
      console.log(error);
    }
  };

  function isPast10PMOfPreviousDay(year: number, month: number, day: number) {
    // Get the current date and time
    const now = new Date();

    // Create a Date object for 10 PM on the previous day
    const previousDay10PM = new Date(year, month - 1, day - 1, 21, 0, 0);

    // Compare the current time with 10 PM of the previous day
    return now > previousDay10PM;
  }

  // 変更情報を更新するAPI
  const handleSaveChange = async (uid: string) => {
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
        title: '前日の午後10時を過ぎているため、予定を変更できません。',
        status: 'error',
        position: 'top',
      });
      return;
    }
    if (!checkIsClassBefChangeExists() || !checkIsAftChangeInfoExists()) {
      toast({
        title: !checkIsClassAftChangeExists()
          ? !checkIsClassBefChangeExists()
            ? '振替元の曜日を選択して下さい。'
            : '振替先の曜日を選択してください。'
          : '',
        status: 'error',
        position: 'top',
      });
      return;
    }
    let isError: boolean = false;
    await getBookedClassInfo(
      bookingChange.yearAftChange,
      bookingChange.monthAftChange,
      bookingChange.dayAftChange,
      getClassName(bookingChange.classAftChange),
      true,
    );

    setIsSaveButtonLoading(true);
    // AtfChangeを追加
    try {
      const response = await fetch('/api/booking/updateClassChangeInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionName: `openDay_${bookingChange.yearAftChange}_${bookingChange.monthAftChange}`,
          docId: `day_${bookingChange.dayAftChange}`,
          fieldName: getClassName(bookingChange.classAftChange),
          newVal: [...aftChangeClass, uid],
        }),
      });
    } catch (e) {
      isError = true;
      console.log(e);
    }

    if (isError) {
      return; //何もしない
    }

    await getBookedClassInfo(
      bookingChange.yearBefChange,
      bookingChange.monthBefChange,
      bookingChange.dayBefChange,
      getClassName(bookingChange.classBefChange),
      false,
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
          newVal: befChangeClass.filter((classInfo) => classInfo !== uid),
        }),
      });
    } catch (e) {
      isError = true;
      console.log(e);
    } finally {
      setIsSaveButtonLoading(false);
      clearClassBefChange(false);
    }

    isError = true;
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

  // recoil管理のbookingChangeInfoListに、新規追加する変更情報Objを設定する関数
  const handleSetBookingChangeInfo = () => {
    if (!checkIsAftChangeInfoExists()) {
      console.log('checkIsAftChangeInfoExists()', checkIsAftChangeInfoExists());
      return; // 何もしない
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

  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setUid(data.uid);
  };

  const usersListWithNull = users?.map((user) => ({
    name: String(user.displayName),
    value: String(user.uid),
  }));
  const usersList = usersListWithNull?.filter((user) => !!user.value && !!user.name);
  const AllowedUidList: string[] = [
    'KZlzeAudgBVPawzaQuT7zo4BLCH3',
    'kqhxd5wy22x8',
    'tfsw7nz9ovb4',
    'mein0000',
    'mein9999',
    'coach0000',
  ];
  if (!AllowedUidList.includes(userInfo.uid)) {
    return <div>許可されていないアカウントです。</div>;
  }

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
            position: 'top',
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

  return (
    <AuthLimited>
      <div className="w-full">
        <div className="w-full">
          {/* まずは予定変更するユーザーを指定する */}
          {!uid && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <SelectObj
                optionList={usersList || [{ value: '', name: '' }]}
                label="予約を変更する生徒を選択"
                className="w-full"
                register={register('uid')}
              />
              <input className="rounded-lg border bg-primary p-2 text-white" type="submit" />
            </form>
          )}

          {isOpenSetmonthAndYearOnDisplayModal ||
            (uid && (
              <div className="w-full">
                <button onClick={() => console.log(uid)}>uid</button>
                {/* header message */}
                <div className="w-full">
                  <div className="w-full gap-4">
                    <div className="mt-5"></div>
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
                        onClick={() => handleSaveChange(uid)}
                        label="保存"
                        variant={
                          checkIsClassBefChangeExists() && checkIsAftChangeInfoExists()
                            ? 'primary'
                            : 'gray'
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
                  <CalendarAdmin uid={uid} year={yearOnDisplay} month={monthOnDisplay} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </AuthLimited>
  );
}
