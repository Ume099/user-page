import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <div>
        <Head>
          <NextSeo
            title="Special Page"
            description="This is a special page description."
            canonical="https://example.com/special-page"
            openGraph={{
              url: 'https://alt-prime.com/lp',
              title: '【福岡市のプログラミングスクール】プライム - PRIME -',
              description:
                '福岡市のプログラミングスクール　プライムは格安で、大学生や社会人になりたての方でも通いやすいコーチングベースのプログラミングスクールです。',
              images: [
                {
                  url: 'https://example.com/images/special-page.jpg',
                  width: 800,
                  height: 600,
                  alt: 'Special Page Image',
                },
              ],
              site_name: 'MyApplication',
            }}
          />
          ここにLPの内容を表示
        </Head>
      </div>
    </>
  );
};

export default Home;
