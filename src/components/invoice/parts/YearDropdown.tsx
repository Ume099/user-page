import { useEffect, useState } from 'react';

type Props = {
  setYear: (num: number) => void;
};

const YearDropdown = (props: Props) => {
  const { setYear } = props;
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    // 現在の年を取得
    const currentYear = new Date().getFullYear();
    // 過去10年分の配列を作成
    const pastYears = Array.from({ length: 10 }, (_, index) => currentYear - index);
    setYears(pastYears);
    // 初期選択を現在の年に設定
    setSelectedYear(currentYear);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(Number(event.target.value));
    setSelectedYear(Number(event.target.value));
  };

  return (
    <div className="text-2xl ml-16">
      <select
        className="border rounded-lg mr-2"
        id="year"
        value={selectedYear ?? ''}
        onChange={handleChange}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <label htmlFor="year">年の請求書を表示中</label>
    </div>
  );
};

export default YearDropdown;
