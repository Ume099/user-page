import { useState, FormEvent } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRecoilState } from 'recoil';
import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import PageListAfterSignIn from '@/components/common/parts/PageListAfterSignIn';
import { LinkNameList, urls } from '@/pages';

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
      alert('ログインしました。'); // 代わりにトーストを使用
      // TODO: ログイン後のページに遷移の処理を書く
    } catch (e) {
      alert('エラーが発生しました。'); // 代わりにトーストを使用
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!userInfo.isSignedIn ? (
        <div className="container mx-auto py-14">
          <h1 className="mb-8 text-2xl font-bold">サインイン</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block" htmlFor="email">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border p-2"
                required
              />
            </div>
            <div>
              <label className="mb-1 block" htmlFor="password">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border p-2"
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className={`rounded bg-primary px-4 py-2 font-bold text-white ${
                  isLoading ? 'cursor-not-allowed opacity-50' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>
          <p>
            パスワードリセットは
            <a className="underline" href="/resetPassword">
              こちら
            </a>
          </p>
        </div>
      ) : (
        <PageListAfterSignIn linkList={linkList} />
      )}
    </>
  );
};

export default Page;
