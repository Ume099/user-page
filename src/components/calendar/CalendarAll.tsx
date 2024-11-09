import DayOfWeek from '@/components/calendar/parts/DayOfWeek';
import DaysAll from '@/components/calendar/parts/DaysAll';

type Props = {
  year: number;
  month: number;
  uid: string;
};

// カレンダー部分のコンポーネント。機能ははDayコンポーネントに集約
const CalendarAll = (props: Props) => {
  const { year, month, uid } = props;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-center text-2xl">
        {year}年 {month}月
      </h1>
      <DayOfWeek />
      <DaysAll uid={uid} year={year} month={month} />
    </div>
  );
};

export default CalendarAll;
