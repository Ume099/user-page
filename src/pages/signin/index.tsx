import { useState, FormEvent } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router'; // 追加
import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import PageListAfterSignIn from '@/components/common/parts/PageListAfterSignIn';
import { LinkNameList, urls } from '@/pages';
import { useToast } from '@chakra-ui/react';

const linkList = urls.map((url, index) => {
  return { text: LinkNameList[index], link: url };
});

export const Page = () => {
  const router = useRouter();
  const redirectTo = router.query.redirectTo;

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo] = useRecoilState<UserInfo>(userInfoState);

  const toast = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);

      setEmail('');
      setPassword('');
      toast({ title: 'ログインしました', position: 'top-right', status: 'success' });

      router.push(typeof redirectTo === 'string' ? redirectTo : '/');
    } catch (error) {
      toast({ title: 'エラーが発生しました。', position: 'top-right', status: 'error' });

      console.log(error);
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
            <a className="underline" href="/resetPass">
              こちら
            </a>
          </p>
        </div>
      ) : (
        <PageListAfterSignIn />
      )}
    </>
  );
};

export default Page;
