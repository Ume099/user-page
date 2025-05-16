import DayOfWeek from '@/components/calendar/parts/DayOfWeek';
import DaysForChangeBookingAdmin from './parts/DaysForChangeBookingAdmin';

type Props = {
  uid: string;
  year: number;
  month: number;
};

// カレンダー部分のコンポーネント。機能ははDayコンポーネントに集約
const CalendarAdmin = (props: Props) => {
  const { uid, year, month } = props;

  return (
    <div className="container mx-auto p-4">
      <DayOfWeek />
      <DaysForChangeBookingAdmin uid={uid} year={year} month={month} />
    </div>
  );
};

export default CalendarAdmin;
