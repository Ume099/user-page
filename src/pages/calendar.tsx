import React from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay } from 'date-fns';

/**
 * 指定の開校日を Date オブジェクトに変換したセットを用意
 */
const highlightDatesString = [
  '2025/01/11',
  '2025/01/12',
  '2025/01/18',
  '2025/01/19',
  '2025/01/25',
  '2025/01/26',
  '2025/02/01',
  '2025/02/02',
  '2025/02/08',
  '2025/02/09',
  '2025/02/22',
  '2025/02/23',
  '2025/03/01',
  '2025/03/02',
  '2025/03/08',
  '2025/03/09',
  '2025/03/22',
  '2025/03/23',
  '2025/04/05',
  '2025/04/06',
  '2025/04/12',
  '2025/04/13',
  '2025/04/26',
  '2025/04/27',
  '2025/05/10',
  '2025/05/11',
  '2025/05/17',
  '2025/05/18',
  '2025/05/24',
  '2025/05/25',
  '2025/06/07',
  '2025/06/08',
  '2025/06/14',
  '2025/06/15',
  '2025/06/28',
  '2025/06/29',
  '2025/07/05',
  '2025/07/06',
  '2025/07/12',
  '2025/07/13',
  '2025/07/26',
  '2025/07/27',
  '2025/08/02',
  '2025/08/03',
  '2025/08/09',
  '2025/08/17',
  '2025/08/23',
  '2025/08/24',
  '2025/09/06',
  '2025/09/07',
  '2025/09/13',
  '2025/09/14',
  '2025/09/27',
  '2025/09/28',
  '2025/10/04',
  '2025/10/05',
  '2025/10/11',
  '2025/10/19',
  '2025/10/25',
  '2025/10/26',
  '2025/11/01',
  '2025/11/02',
  '2025/11/08',
  '2025/11/09',
  '2025/11/15',
  '2025/11/16',
  '2025/12/06',
  '2025/12/07',
  '2025/12/13',
  '2025/12/14',
  '2025/12/20',
  '2025/12/21',
  '2026/01/10',
  '2026/01/11',
  '2026/01/17',
  '2026/01/18',
  '2026/01/24',
  '2026/01/25',
  '2026/02/01',
  '2026/02/07',
  '2026/02/08',
  '2026/02/14',
  '2026/02/15',
  '2026/02/28',
  '2026/03/07',
  '2026/03/08',
  '2026/03/14',
  '2026/03/15',
  '2026/03/28',
  '2026/03/29',
];

// Dateにパースしたものを Set に格納
const highlightSet = new Set(
  highlightDatesString.map((str) => {
    const [yyyy, mm, dd] = str.split('/');
    return format(new Date(Number(yyyy), Number(mm) - 1, Number(dd)), 'yyyy-MM-dd');
  }),
);

/**
 * 2025年1月～2026年3月までを表示
 * @returns
 */
export default function CalendarPDF() {
  // 2025/01/01 ～ 2026/03/31 を通しで一括生成
  // ただし実際は各月ごとにテーブル化する
  const startYear = 2025;
  const startMonth = 1; // 1月 (0始まりではない)
  const endYear = 2026;
  const endMonth = 3; // 3月

  // 各月ごとのHTMLを生成
  const calendars = [];
  let currentYear = startYear;
  let currentMonth = startMonth;

  while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
    calendars.push(renderMonthCalendar(currentYear, currentMonth - 1));
    // 次の月へ
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  return (
    <div style={{ margin: '20px' }}>
      <h1>開校日カレンダー（2025年1月～2026年3月）</h1>
      <div className="grid grid-cols-4 space-x-2">{calendars}</div>
    </div>
  );
}

/**
 * 指定年月のカレンダーtable要素を生成
 * @param year
 * @param month 0始まり (0=1月)
 * @returns JSX
 */
function renderMonthCalendar(year: number, month: number) {
  const baseDate = new Date(year, month, 1);
  const start = startOfMonth(baseDate);
  const end = endOfMonth(baseDate);

  // 1ヶ月分の日付を全部取得
  const days = eachDayOfInterval({ start, end });

  // 月名
  const title = format(baseDate, 'yyyy年M月');

  // 曜日 (0=日, 1=月, ..., 6=土)
  // 週ごとの配列に分割して <tr> 行を作る
  const weeks: Date[][] = [];
  let tempWeek: Date[] = [];

  // 前の月と合わせるため、1日より前の空白セルを入れる
  // 例：1日の曜日が 水曜(3) なら、[日(0),月(1),火(2)] の空セルが必要
  const firstDayWeek = getDay(days[0]); // 0=日
  for (let i = 0; i < firstDayWeek; i++) {
    // ダミーとして new Date() をマイナス日付に入れられるが
    // ここは "null" などで空セル管理
    tempWeek.push(new Date(NaN)); // invalid date →空白セル扱い
  }

  // ループで days[] を入れていく
  for (const day of days) {
    tempWeek.push(day);
    if (tempWeek.length === 7) {
      weeks.push(tempWeek);
      tempWeek = [];
    }
  }

  // 月末に余りがあればpush
  if (tempWeek.length > 0) {
    while (tempWeek.length < 7) {
      tempWeek.push(new Date(NaN)); //空白セル
    }
    weeks.push(tempWeek);
  }

  // テーブルを構築
  return (
    <div key={`${year}-${month + 1}`} style={{ marginBottom: '12px' }}>
      <h2 style={{ marginTop: '2px', marginBottom: '0.5em' }}>{title}</h2>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>日</th>
            <th style={thStyle}>月</th>
            <th style={thStyle}>火</th>
            <th style={thStyle}>水</th>
            <th style={thStyle}>木</th>
            <th style={thStyle}>金</th>
            <th style={thStyle}>土</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, widx) => (
            <tr key={widx}>
              {week.map((dateObj, idx) => {
                if (isNaN(dateObj.getTime())) {
                  // 空白セル
                  return <td key={idx} style={tdStyle}></td>;
                } else {
                  const yyyyMMdd = format(dateObj, 'yyyy-MM-dd');
                  const dayNum = dateObj.getDate();
                  // 開校日かどうか判断
                  const isHighlight = highlightSet.has(yyyyMMdd);
                  return (
                    <td
                      key={idx}
                      style={{
                        ...tdStyle,
                        backgroundColor: isHighlight ? '#ffcc66' : '',
                        fontWeight: isHighlight ? 'bold' : 'normal',
                      }}
                    >
                      {dayNum}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'center',
  border: '1px solid #ccc',
  padding: '6px',
  width: '2.5em',
  height: '2em',
};

const tdStyle: React.CSSProperties = {
  width: '2.5em',
  height: '2.5em',
  textAlign: 'right',
  padding: '4px',
  border: '1px solid #ccc',
  verticalAlign: 'middle',
};
