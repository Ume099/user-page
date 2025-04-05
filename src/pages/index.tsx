'use client';

import { NextPage } from 'next';

import { linkList } from '@/constant/link';
import Layout from '@/components/common/Layout';
import { Routes } from '@/lib/data/routes';
import Link from 'next/link';
import { getIcon } from '@/lib/util/getIcon';
import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import DayOfWeek from '@/components/calendar/parts/DayOfWeek';
import DaysOpen from '@/components/calendar/parts/DaysOpen';
// import { DaysOpenWrapper } from '@/components/Suspence/DaysOpenWrapper';

// URL配列を作成する関数
const getUrls = () => {
  return Object.values(Routes).map((route) => route.url);
};

const getLinkNameList = () => {
  return Object.values(Routes).map((route) => route.key);
};

// URL配列を取得
export const urls = getUrls();
export const LinkNameList = getLinkNameList();

const date = new Date();
const currentMonth = date.getMonth();
const currentYear = date.getFullYear();

const Home: NextPage = () => {
  const toast = useToast();

  const [yearOnDisplay, setYearOnDisplay] = useState<number>(currentYear);
  const [monthOnDisplay, setmonthOnDisplay] = useState(currentMonth + 1);

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
    <>
      <Layout
        path={Routes.INDEX.url}
        title={Routes.INDEX.title}
        noTitleTemplate={true}
        isTopPage={true}
      >
        <div className="mx-12 mt-16 flex flex-col justify-center border-b-4">
          <h1 className="mb-4">ホーム</h1>
          <div className="gap-y-2">
            {linkList.map((link, index) => (
              <Link
                href={link.path}
                key={index}
                className="mt-2 flex w-full justify-start rounded-md border bg-yellow-100 p-4 px-4"
              >
                {getIcon(link.name)}
                <p className="ml-2 font-bold">{link.name}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-10 p-10">
          <h1 className="">開校日</h1>
          {/* カレンダー本体 */}
          <div className="">
            <div className="w-full">
              <p className="text-xl">
                {yearOnDisplay}
                <span>年</span>
              </p>
              <div className="flex w-full items-center space-x-2 rounded-lg text-xl">
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
            <div className="container mt-4 w-full">
              <DayOfWeek />
              <DaysOpen year={yearOnDisplay} month={monthOnDisplay} />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
