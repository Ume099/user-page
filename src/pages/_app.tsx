import { initializeFirebaseApp } from '@/lib/firebase/firebase';
import '@/styles/globals.css';
import { RecoilRoot } from 'recoil';

import GoogleTagManager from '@/components/common/GoogleTagManager';
import MessageDialog from '@/components/common/MessageDialog';
import { googleTagManagerId } from '@/utils/gtm';

import Header from '@/components/common/Header';
import SideBar from '@/components/common/SideBar';
import { AuthProvider } from '@/feature/auth/provider/AuthProvider';
import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import type { AppProps } from 'next/app';

import {HeroUIProvider} from "@heroui/react";
import { NextSeo } from 'next-seo';

initializeFirebaseApp();

const googleVerificationContent = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <GoogleTagManager googleTagManagerId={googleTagManagerId} />
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
      </Head>
      <RecoilRoot>
        <ChakraProvider>
          <AuthProvider>
          <HeroUIProvider>
            <Header />
            <SideBar />
            <Component {...pageProps} />
            <MessageDialog />
            </HeroUIProvider>
          </AuthProvider>
        </ChakraProvider>
      </RecoilRoot>
    </>
  );
}
export default MyApp;
