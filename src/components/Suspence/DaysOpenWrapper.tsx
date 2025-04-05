// import { createOpenDaysResource } from '@/lib/util/suspenseUtils';
// import React, { Suspense, useMemo } from 'react';
// import DaysOpen from '../calendar/parts/DaysOpen';

// type Props = {
//   year: number;
//   month: number;
// };

// /**
//  * Suspense Boundaryとして機能するラッパ
//  */
// export const DaysOpenWrapper: React.FC<Props> = ({ year, month }) => {
//   const collectionName = useMemo(() => `openDay_${year}_${month}`, [year, month]);

//   // 年・月が変わるたびに新しいリソースを生成
//   const openDaysResource = useMemo(() => {
//     return createOpenDaysResource(collectionName);
//   }, [collectionName]);

//   return (
//     <Suspense fallback={<div className="h-[522px] w-full">Loading...</div>}>
//       <DaysOpen year={year} month={month} openDaysResource={openDaysResource} />
//     </Suspense>
//   );
// };
