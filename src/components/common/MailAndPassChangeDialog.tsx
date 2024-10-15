import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { UserData } from '@/lib/userSettings';
import { LinkNameList, urls } from '@/pages';
import axios from 'axios';
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import useSWR from 'swr';
import PageListAfterSignIn from './parts/PageListAfterSignIn';
import { toast } from 'react-toastify'; // 変更

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const linkList = urls.map((url, index) => {
  return { text: LinkNameList[index], link: url };
});

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type Status = 'email' | 'password' | 'done';

const MailAndPassChangeDialog = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [userInfo] = useRecoilState<UserInfo>(userInfoState);
  const auth = getAuth();
  const user = auth.currentUser;
  const { data: users, error, mutate } = useSWR<UserData[]>('/api/userActions/fetchUsers', fetcher);
  const [status, useStatus] = useState<Status>('email');

  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setPassword(userInfo.uid);
    setEmail(user?.email || '');
  }, []);

  const handleEmailChange = async () => {
    if (!user) {
      console.log('user is null');
      return;
    }
    await updateUserEmail(user.uid);
  };

  const updateUserEmail = async (uid: string) => {
    setLoading(true);
    let error = false;
    if (!isValidEmail(email)) {
      toast.warning('正しいメールアドレスを入力して下さい。');
      setLoading(false);
      return;
    }
    console.log(email, '<<<<<<<<<<email');
    try {
      await axios.put('/api/userActions/updateEmail', {
        uid,
        newEmail: email || '',
      });
      await mutate();
    } catch (e) {
      error = true;
      console.error(e);
      toast.error('メールアドレスの登録に失敗しました。');
    } finally {
      if (!error) {
        setEmail(String(user?.email || ''));
        useStatus('password');
        toast.success('新しいメールアドレスを登録しました。');
      }
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user || !newPassword || !userInfo.uid) {
      return;
    }
    let error = false;
    try {
      const credential = EmailAuthProvider.credential(user.email!, userInfo.uid);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setMessage('パスワードが更新されました');
    } catch (e: any) {
      error = true;
      setMessage(e.message);
    }
    if (!error) {
      useStatus('done');
    }
  };

  if (status === 'email') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-300 opacity-80">
        <div className="rounded-lg border-2 border-primary bg-white px-10 py-10 shadow-lg">
          <h1 className="mb-4 font-bold text-primary">メールアドレスを設定してください。</h1>
          <div className="mb-4">
            <label className="mb-2 block font-bold text-primary-dark">新しいメールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
            />
            <ButtonOriginal
              variant="primary"
              label="メールアドレスを変更"
              onClick={handleEmailChange}
              loading={loading}
            />
          </div>
          {message && <p className="text-red-500">{message}</p>}
        </div>
      </div>
    );
  }

  if (status === 'password') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-300 opacity-80">
        <div className="rounded-lg border-2 border-primary bg-white px-10 py-10 shadow-lg">
          <h1 className="mb-4 font-bold text-primary">新しいパスワードを設定してください。</h1>
          <div className="mb-4">
            <label className="mb-2 block font-bold text-primary-dark">現在のパスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block font-bold text-primary-dark">新しいパスワード</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border-2 border-gray-300 px-3 py-2"
            />
            <ButtonOriginal
              variant="primary"
              label="パスワードを変更"
              onClick={handlePasswordChange}
            />
          </div>
          {message && <p className="text-red-500">{message}</p>}
        </div>
      </div>
    );
  }

  if (status === 'done') {
    return <PageListAfterSignIn linkList={linkList} />;
  }

  return <div>問題が発生しました。管理者に問い合わせてください。</div>;
};

export default MailAndPassChangeDialog;
