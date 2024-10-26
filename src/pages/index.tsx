import { NextPage } from 'next';
import { AuthGuard } from '@/feature/auth/component/AuthGuard/AuthGuard';

import { linkList } from '@/components/common/Header';
import Layout from '@/components/common/Layout';
import { Routes } from '@/lib/data/routes';
import Link from 'next/link';

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
    <AuthGuard>
      <Layout
        path={Routes.INDEX.url}
        title={Routes.INDEX.title}
        noTitleTemplate={true}
        isTopPage={true}
      >
        <div className="mx-12 mt-16 border-b-4 flex flex-col justify-center">
          <p className="mb-4">ホーム</p>
          {linkList.map((link, index) => (
            <Link
              href={link.link}
              key={index}
              className="mx-12 w-auto mb-4 mt-4 flex rounded-md border bg-yellow-100 px-8 py-4"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default Home;
