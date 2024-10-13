import { toast } from 'react-toastify';

import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { useRecoilState } from 'recoil';

import MailAndPassChangeDialog from '@/components/common/MailAndPassChangeDialog';
import axios from 'axios';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export const Page = (): JSX.Element => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useRecoilState<UserInfo>(userInfoState);

  const uid = searchParams.get('uid');
  const mail = searchParams.get('dummyMail')?.replace('___', '+');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (!uid || !mail) {
      return; //何もしない
    }
    getUserIsFirstTime();
    setIsLoading(true);
    e.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, mail, uid);
      toast.success('ログインしました。');
      //TODO: ログイン後のページに遷移の処理を書く
    } catch (e) {
      toast.error('エラーが発生しました。管理者に問い合わせてください。');
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  // dbからユーザー情報を取得する関数
  const getUserIsFirstTime = async () => {
    let isError = false;
    let result: boolean;
    try {
      const res = await axios.get(`/api/fetchFireStore?collectionName=students&docId=${uid || ''}`);
      result = res.data.isFirstTime.booleanValue;
    } catch (error) {
      isError = true;
      return; //何もしない
    }

    if (!isError) {
      setUserInfo({ ...userInfo, isFirstTime: result });
    }
  };

  return (
    <div>
      {!userInfo.isSignedIn ? (
        <div style={{ padding: '3rem 0' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
            サインイン(初回ログイン)
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <button
              type="submit"
              disabled={isLoading}
              style={{ marginTop: '2rem', height: '6rem', width: '12rem' }}
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
            <div style={{ marginTop: '1rem', display: 'flex' }}>
              <p>二回目以降のサインインは</p>
              <a
                style={{ marginLeft: '0.5rem', fontWeight: 'bold', textDecoration: 'underline' }}
                href="/signin"
              >
                こちら
              </a>
            </div>
          </form>
        </div>
      ) : (
        <MailAndPassChangeDialog />
      )}
    </div>
  );
};

export default Page;
