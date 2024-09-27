// 1~12月のリスト
export type MONTH_NAME_TYPE =
  | '1月'
  | '2月'
  | '3月'
  | '4月'
  | '5月'
  | '6月'
  | '7月'
  | '8月'
  | '9月'
  | '10月'
  | '11月'
  | '12月';

export const MONTH_NAME: MONTH_NAME_TYPE[] = [
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

// 曜日
export type DayType = '月' | '火' | '水' | '木' | '金' | '土' | '日';
export type DayTypeEng = 'Sun' | 'Mon' | 'Thu' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

// 月曜始まり
export const DAY: DayType[] = ['月', '火', '水', '木', '金', '土', '日'];
export const DAY_NAME = ['-', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'];

export const DAY_STARTS_WITH_SUN: DayType[] = ['日', '月', '火', '水', '木', '金', '土'];
export const DAY_ENGLISH: DayTypeEng[] = ['Sun', 'Mon', 'Thu', 'Wed', 'Thu', 'Fri', 'Sat'];

// 曜日を取得する関数
export const getDayOfWeek = (year: number, month: number, day: number): string => {
  // JavaScriptのDateオブジェクトを作成
  const date = new Date(year, month - 1, day);
  const dayIndex = date.getDay();
  return DAY_STARTS_WITH_SUN[dayIndex];
};

export const getDayOfWeekEng = (year: number, month: number, day: number): string => {
  // JavaScriptのDateオブジェクトを作成
  const date = new Date(year, month - 1, day);
  const dayIndex = date.getDay();
  return DAY_ENGLISH[dayIndex];
};

// 授業の種類
export type CLASS_TIME_TYPE =
  | '10:00~10:50'
  | '11:00~11:50'
  | '13:00~13:50'
  | '14:00~14:50'
  | '15:00~15:50'
  | '16:00~16:50'
  | '17:00~17:50';

export const CLASS_TIME = [
  '10:00~10:50',
  '11:00~11:50',
  '13:00~13:50',
  '14:00~14:50',
  '15:00~15:50',
  '16:00~16:50',
  '17:00~17:50',
];

type StringValue = {
  stringValue: string;
  valueType: 'stringValue';
};

type ArrayValue = {
  arrayValue: {
    values: StringValue[];
  };
  valueType: 'arrayValue';
};

type ClassListApiType = {
  classList: ArrayValue;
};

export const getClassListFormatted = (obj: ClassListApiType): string[] => {
  const Obj = {
    classList: obj.classList.arrayValue.values.map((cl) => cl.stringValue),
  };
  return Obj.classList;
};
