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

initializeFirebaseApp();

const googleVerificationContent = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <GoogleTagManager googleTagManagerId={googleTagManagerId} />
      <RecoilRoot>
        <Head>
          <title>EXAMPLE TITLE</title>
          <meta name="description" content="EXAMPLE DESCRIPTION" />
          <meta
            name="google-site-verification"
            content={googleVerificationContent || 'default-verification-code'}
          />
        </Head>
        <ChakraProvider>
          <AuthProvider>
            <Header />
            <SideBar />
            <Component {...pageProps} />
            <MessageDialog />
          </AuthProvider>
        </ChakraProvider>
      </RecoilRoot>
    </>
  );
}
export default MyApp;
