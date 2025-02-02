import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import { getAuth, signOut } from 'firebase/auth';
import { useRecoilState } from 'recoil';

import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';

const PageListAfterSignIn = (): JSX.Element => {
  const [userInfo, setUserInfo] = useRecoilState<UserInfo>(userInfoState);

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
      <div className="flex h-screen w-screen items-center justify-center bg-gray-300 opacity-80">
        <div className=" rounded-lg border-2 border-primary bg-white px-10 py-10 shadow-lg">
          <h1 className="mb-4 font-bold text-primary">ログインに成功しました</h1>
        </div>
      </div>
    </>
  );
};

export default PageListAfterSignIn;
