import { useState, FormEvent } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import PageListAfterSignIn from '@/components/common/parts/PageListAfterSignIn';
import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { LinkNameList, urls } from '@/pages';
import { useRecoilState } from 'recoil';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toastのスタイル

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
      toast.success('ログインしました。', {
        position: "top-center",
      });
      // TODO: ログイン後のページに遷移の処理を書く
    } catch (e) {
      toast.error('エラーが発生しました。', {
        position: "top-center",
      });
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!userInfo.isSignedIn ? (
        <div className="container mx-auto py-14">
          <h1 className="text-2xl font-bold">サインイン</h1>
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">メールアドレス</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">パスワード</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 text-white bg-blue-500 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>
          <ToastContainer />
        </div>
      ) : (
        <PageListAfterSignIn linkList={linkList} />
      )}
    </>
  );
};

export default Page;
