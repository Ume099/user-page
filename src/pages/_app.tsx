import { initializeFirebaseApp } from '@/lib/firebase/firebase';
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import { RecoilRoot } from 'recoil';

import GoogleTagManager from '@/components/common/GoogleTagManager';
import MessageDialog from '@/components/common/MessageDialog';
import { googleTagManagerId } from '@/utils/gtm';

import Header from '@/components/common/Header';
import SideBar from '@/components/common/SideBar';
import { AuthProvider } from '@/feature/auth/provider/AuthProvider';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

initializeFirebaseApp();

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <GoogleTagManager googleTagManagerId={googleTagManagerId} />
      <RecoilRoot>
        <AuthProvider>
          <Header />
          <div className="flex">
            <SideBar />
            <Component {...pageProps} />
          </div>
          <MessageDialog />
          <ToastContainer />
        </AuthProvider>
      </RecoilRoot>
    </>
  );
}
export default MyApp;
