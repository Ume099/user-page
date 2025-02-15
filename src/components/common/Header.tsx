import { Routes } from '@/lib/data/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilState } from 'recoil';

import { useEffect, useState } from 'react';

import type { UserInfo } from '@/hooks/atom/userInfo';

import { useAuthContext } from '@/feature/auth/provider/AuthProvider';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';

import { userInfoState } from '@/hooks/atom/userInfo';
import ButtonOriginal from './parts/ButtonOriginal';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { UserData } from '@/lib/userSettings';
import axios from 'axios';
import { displaNameState } from '@/hooks/atom/displayNameList';
import { displayName } from '@/hooks/atom/models/types';

// データフェッチ用の fetcher 関数
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Header: React.FC = () => {
  const [userInfo, setUserInfo] = useRecoilState<UserInfo>(userInfoState);
  const [loginMessage, setLoginMessage] = useState('未ログイン');
  const router = useRouter();

  const currentPath = router.asPath;

  // Auth周りの更新を自動で検知して実行
  useEffect(() => {
    const auth = getAuth();

    // ログイン状態が変化した時に実行される関数
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserInfo({
          uid: user.uid,
          isSignedIn: true,
          userName: user.displayName,
          isFirstTime: false,
        });
        setLoginMessage('としてログイン中');
      } else {
        // No user is signed in.
        setLoginMessage('未ログイン');
        setUserInfo({ ...userInfo, isSignedIn: false, userName: null });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const { user } = useAuthContext();
  //const router = useRouter();

  // サインアウトの関数
  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (e) {
      console.log(e);
    } finally {
      setUserInfo({ ...userInfo, isSignedIn: false });
    }
  };

  return (
    <>
      {/* ヘッダー分の余白を生成 */}
      <div className="mt-14"></div>
      {/* ヘッダー本体 */}
      <header className="fixed top-0 z-[997] flex w-full justify-center shadow-md">
        <div className="w-full">
          <nav className="w-full bg-white">
            <div className="flex w-full items-center justify-between">
              <div className="block w-full">
                <ul className="select-none md:flex">
                  <li>
                    <div className="flex h-14 w-full items-center justify-between">
                      <div className="flex px-3 pl-8"></div>

                      <Link href={Routes.INDEX.url}>
                        <Image
                          src="/lp/util/logo_long.png"
                          width={128}
                          height={64}
                          alt="プライム"
                        />
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="flex w-full justify-end lg:mr-16">
                {userInfo.isSignedIn && (
                  <ButtonOriginal
                    onClick={handleSignOut}
                    label="ログアウト"
                    variant="error"
                    className="bg-red-600 !py-0"
                  />
                )}
                {!user && (
                  <div className="h-wrap no-shrink mx-4 flex gap-x-4">
                    <Link
                      href={{
                        pathname: '/signin',
                        query: { redirectTo: currentPath },
                      }}
                      className="self-center rounded-lg bg-primary-medium px-2 py-3"
                    >
                      ログイン
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden shrink-0 items-center md:pr-6">
              {!userInfo.isSignedIn && (
                <Link
                  href={{
                    pathname: '/signin',
                    query: { redirectTo: currentPath },
                  }}
                  className="gradation-background menu-list self-center rounded px-8 py-3 md:mr-4"
                >
                  ログイン
                </Link>
              )}
              {!user && (
                <Link
                  href="/signup"
                  className="self-center rounded bg-yellow-400 px-8 py-3 font-semibold text-gray-800"
                >
                  新規登録
                </Link>
              )}
              {userInfo.userName ? (
                <form method="post" action="/signin">
                  <button
                    onClick={handleSignOut}
                    className="self-center rounded bg-red-600 !py-0 px-4 text-white"
                  >
                    ログアウト
                  </button>
                </form>
              ) : (
                <form method="post" action="/signin">
                  <Link
                    href={{
                      pathname: '/signin',
                      query: { redirectTo: currentPath },
                    }}
                    className="self-center rounded bg-red-600 !py-0 px-4 text-white"
                  >
                    ログイン
                  </Link>
                </form>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
