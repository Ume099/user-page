import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { LinkNameList, urls } from '@/pages';
import PageListAfterSignIn from '@/components/common/parts/PageListAfterSignIn';
import { useRecoilState } from 'recoil';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FormEvent, useState } from 'react';

const linkList = urls.map((url, index) => {
  return { text: LinkNameList[index], link: url };
});

export const Page = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useRecoilState<UserInfo>(userInfoState);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      // Toast or alert for success
      alert('ログインしました。');
      // TODO: ログイン後のページに遷移の処理を書く
    } catch (e) {
      // Toast or alert for error
      alert('エラーが発生しました。');
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!userInfo.isSignedIn ? (
        <div className="py-14 max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center">サインイン</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">メールアドレス</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">パスワード</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className={`px-4 py-2 text-white bg-primary rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <PageListAfterSignIn linkList={linkList} />
      )}
    </>
  );
};

export default Page;
