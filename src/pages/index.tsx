import { NextPage } from 'next';
import { AuthGuard } from '@/feature/auth/component/AuthGuard/AuthGuard';

import { linkList } from '@/constant/link';
import Layout from '@/components/common/Layout';
import { Routes } from '@/lib/data/routes';
import Link from 'next/link';
import { ReactElement } from 'react';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { MdEditCalendar } from 'react-icons/md';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { FaHome } from 'react-icons/fa';
import { RiAdminLine } from 'react-icons/ri';
import { getIcon } from '@/lib/util/getIcon';

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

const Home: NextPage = () => {
  return (
    <>
      <AuthGuard>
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
        </Layout>
      </AuthGuard>
    </>
  );
};

export default Home;
