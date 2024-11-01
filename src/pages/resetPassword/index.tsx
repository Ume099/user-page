import { useState, FormEvent } from 'react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useRecoilState } from 'recoil';
import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { LinkNameList, urls } from '@/pages';
import { FirebaseError } from 'firebase/app';

const linkList = urls.map((url, index) => {
  return { text: LinkNameList[index], link: url };
});

export const Page = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const auth = getAuth();

  const handleSendResetPasswordEmail = async () => {
    const actionCodeSettings = {
      // パスワード再設定後のリダイレクト URL
      url: 'https://www.alt-prime.com/signin',
      handleCodeInApp: false,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings)
      .then((resp) => {
        // メール送信成功
        console.log(resp);
      })
      .catch((error) => {
        // メール送信失敗
        console.log(error);
        throw FirebaseError;
      });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    let error = false;
    try {
      await handleSendResetPasswordEmail();
    } catch (e) {
      alert('エラーが発生しました。'); // 代わりにトーストを使用
      console.log(e);
      error = true;
    } finally {
      setIsLoading(false);
    }
    if (!error) {
      alert('パスワード再設定用メールを送信しました。'); // 代わりにトーストを使用
      setEmail('');
    }
  };

  return (
    <>
      <div className="container mx-auto py-14">
        <h1 className="mb-8 text-2xl font-bold">パスワードリセット</h1>
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
          <div className="flex justify-center">
            <button
              type="submit"
              className={`rounded bg-primary px-4 py-2 font-bold text-white ${
                isLoading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? '送信中...' : 'パスワード再設定メールを送信'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
