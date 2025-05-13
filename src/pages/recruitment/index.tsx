import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useToast } from '@chakra-ui/react';
import ButtonOriginal from '@/components/common/parts/ButtonOriginal';

type FormValues = {
  email: string;
  fullName: string;
  phone: string;
  currentJob: string; // 追加：現在の職業（例：大学名と学年）
  subject: string;
  experience: string;
  motivation: string;
  interviewTime: string; // 面接希望時間帯
  agree: boolean;
};

const interviewOptions = [
  { value: '平日 午後 6:00 ~ ', label: '平日 午後 6:00 ~ ' },
  { value: '土日祝 午前 10:00 ~ 12:00', label: '土日祝 午前 10:00 ~ 12:00' },
  { value: '土日祝 午後 1:00 ~ 3:00', label: '土日祝 午後 1:00 ~ 3:00' },
  { value: '土日祝 午後 3:00 ~ 5:00', label: '土日祝 午後 3:00 ~ 5:00' },
  { value: 'その他', label: 'その他' },
];

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [isFormSent, setIsFormSent] = useState(false);

  // ページ離脱時に未送信の場合、警告を表示
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message = '本当にページを離れてもよろしいですか？(※応募フォームは送信されていません。)';
      event.returnValue = message;
      return message;
    };
    if (!isFormSent) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFormSent]);

  const sendMail = async (formData: FormValues) => {
    try {
      const res = await fetch('/api/recruitment/sendMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(res.status);
      toast({
        title: res.status === 200 ? '応募メールを送信しました。' : 'メール送信に失敗しました。',
        status: res.status === 200 ? 'success' : 'warning',
        position: 'top-right',
      });
      reset();
      setIsFormSent(true);
    } catch (error) {
      console.error(error);
      toast({
        title: 'メール送信に失敗しました。\n再度送信してください。',
        status: 'error',
        position: 'top-right',
      });
    }
    setLoading(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    setLoading(true);
    console.log('送信データ：', formData);
    await sendMail(formData);
    setLoading(false);
  };

  return (
    <>
      <div className="min-h-screen bg-blue-50">
        <NextSeo
          title="プログラミング教室プライム 講師アルバイト応募フォーム"
          description="プログラミング教室プライム講師アルバイト応募用フォームです。"
          canonical="https://example.com/lecturer-application"
          openGraph={{
            url: 'https://example.com/lecturer-application',
            title: 'コードアドベンチャー 講師アルバイト応募フォーム',
            description: 'プログラミング講師として活躍いただく方を募集しています。',
            images: [
              {
                url: 'https://example.com/images/lecturer.jpg',
                width: 800,
                height: 600,
                alt: '講師アルバイト応募',
              },
            ],
            site_name: 'MyApplication',
          }}
        />
        <div className="flex flex-col items-center px-8 py-10">
          <div className="mb-6 flex w-[400px] items-center justify-center rounded-lg pb-2 pt-8">
            <Image src="/logo/PRIME_bg_white.png" width={300} height={80} alt="プライム" />
          </div>
          <h2 className="mb-2 text-center text-2xl font-bold">プログラミング教室プライム</h2>
          <h3 className="mb-6 text-xl">講師アルバイト応募フォーム</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow"
          >
            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block font-medium">
                メールアドレス
                <p className="mb-px mt-1 text-xs font-bold text-red-500">※必須</p>
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded border p-2"
                {...register('email', { required: 'メールアドレスは必須です' })}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* 氏名 */}
            <div>
              <label htmlFor="fullName" className="block font-medium">
                氏名 (例: <span className="text-sm font-bold">プライム 太郎</span>)
                <p className="mb-px mt-1 text-xs font-bold text-red-500">※必須</p>
              </label>
              <input
                id="fullName"
                type="text"
                className="w-full rounded border p-2"
                {...register('fullName', { required: '氏名は必須です' })}
              />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
            </div>

            {/* 電話番号 */}
            <div>
              <label htmlFor="phone" className="block font-medium">
                電話番号
              </label>
              <p className="mb-px mt-1 text-xs font-bold text-red-500">※必須</p>
              <input
                id="phone"
                type="tel"
                className="w-full rounded border p-2"
                {...register('phone', { required: '電話番号は必須です' })}
              />
            </div>

            {/* 現在の職業 */}
            <div>
              <label htmlFor="currentJob" className="block font-medium">
                現在の職業（例：大学3年生）
                <p className="mb-px mt-1 text-xs font-bold text-red-500">※必須</p>
              </label>
              <input
                id="currentJob"
                type="text"
                className="w-full rounded border p-2"
                {...register('currentJob', {
                  required: '現在の職業を入力してください',
                })}
              />
              {errors.currentJob && (
                <p className="text-sm text-red-500">{errors.currentJob.message}</p>
              )}
            </div>

            {/* 担当希望科目 */}
            <div>
              <label htmlFor="subject" className="block font-medium">
                将来的に上級コース（React）受講生への指導を希望しますか？
              </label>

              <p className="mb-px mt-1 text-xs font-bold text-red-500">※必須</p>
              <select
                id="subject"
                className="w-full rounded border p-2"
                {...register('subject', {
                  required: '回答してください。',
                })}
              >
                <option value="">選択してください</option>
                {['希望する', '希望しない', 'わからない'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
            </div>

            {/* アルバイト歴 */}
            <div>
              <label htmlFor="experience" className="block font-medium">
                アルバイト歴（あれば）
              </label>
              <textarea
                id="experience"
                className="w-full rounded border p-2"
                rows={4}
                {...register('experience')}
              />
            </div>

            {/* プログラミングのご経験 */}
            <div>
              <label htmlFor="motivation" className="block font-medium">
                プログラミングのご経験 （学習経験などあれば）
              </label>
              <textarea
                id="motivation"
                className="w-full rounded border p-2"
                rows={4}
                {...register('motivation')}
              />
              {errors.motivation && (
                <p className="text-sm text-red-500">{errors.motivation.message}</p>
              )}
            </div>

            {/* 面接の希望時間帯 */}
            <div>
              <label htmlFor="interviewTime" className="block font-medium">
                面接の希望時間帯
                <p className="mb-px mt-1 text-xs font-bold text-red-500">※必須</p>
              </label>
              <select
                id="interviewTime"
                className="w-full rounded border p-2"
                {...register('interviewTime', {
                  required: '面接希望時間帯を選択してください',
                })}
              >
                <option value="">選択してください</option>
                {interviewOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.interviewTime && (
                <p className="text-sm text-red-500">{errors.interviewTime.message}</p>
              )}
            </div>

            {/* 個人情報の取り扱いに関する同意 */}
            <label htmlFor="agree" className="!mt-8 mb-2 block font-medium">
              個人情報の取り扱いについて
            </label>
            <div className="rounded border bg-gray-50 p-4">
              <p className="mb-2 text-sm ">
                当社は、応募者の個人情報を厳重に管理し、講師アルバイトの選考および採用に関する連絡、
                ならびに応募に関するご案内のためにのみ利用いたします。
                <br />
                ご提供いただいた個人情報は、法令に基づく場合を除き、第三者に提供することはありません。
                <br />
                ご応募の際は、上記の個人情報の取り扱いに同意の上、ご応募いただくものとします。
              </p>
              <p className="mb-px mt-1 text-xs font-bold text-red-500">※必須</p>
              <div className="flex items-center">
                <input
                  id="agree"
                  type="checkbox"
                  className="mr-2"
                  {...register('agree', {
                    required: '個人情報の取り扱いに同意してください',
                  })}
                />
                <label htmlFor="agree" className="font-medium">
                  個人情報の取り扱いに同意します
                </label>
              </div>
              {errors.agree && <p className="text-sm text-red-500">{errors.agree.message}</p>}
            </div>

            <ButtonOriginal
              label="送信する"
              loading={loading}
              className="w-full !bg-blue-600 font-bold text-white"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
