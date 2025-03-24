import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type FormValues = {
  email: string;
  firstChoice: string;
  secondChoice: string;
  studentName: string;
  studentKana: string;
  grade: string;
  phone: string;
  inquiry: string;
  agree: boolean;
};

const timeOptions = [
  { value: '土曜日 13:00~13:50', label: '土曜日 13:00~13:50' },
  { value: '土曜日 14:00~14:50', label: '土曜日 14:00~14:50' },
  { value: '日曜日 10:00~10:50', label: '日曜日 10:00~10:50' },
  { value: '日曜日 11:00~11:50', label: '日曜日 11:00~11:50' },
  { value: '日曜日 13:00~13:50', label: '日曜日 13:00~13:50' },
  { value: '日曜日 14:00~14:50', label: '日曜日 14:00~14:50' },
  { value: 'その他の時間を希望（土日のみ）', label: 'その他の時間を希望（土日のみ）' },
];

const gradeOptions = [
  { value: '年長', label: '年長' },
  { value: '小1', label: '小1' },
  { value: '小2', label: '小2' },
  { value: '小3', label: '小3' },
  { value: '小4', label: '小4' },
  { value: '小5', label: '小5' },
  { value: '小6', label: '小6' },
  { value: '中1', label: '中1' },
  { value: '中2', label: '中2' },
  { value: '中3', label: '中3' },
  { value: '高1', label: '高1' },
  { value: '高2', label: '高2' },
  { value: '高3', label: '高3' },
];

type OpenDayObj = {
  id: string;
  date: string;
  dayOfWeek: string;
  class1: string;
  class2: string;
  class3: string;
  class4: string;
  class5: string;
};

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
  const [openDays, setOpenDays] = useState<string[] | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message = '本当にページを離れてもよろしいですか？(※フォームは送信されていません。)';
      event.returnValue = message;
      return message;
    };
    if (!isFormSent) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
    // コンポーネントのアンマウント時にイベントリスナーを解除
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFormSent]);

  const sendMail = async (formData: FormValues) => {
    try {
      const res = await fetch('/api/caForm/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log(res.status);
      if (data) {
        toast({
          title: res.status === 200 ? '発行メールを送信しました。' : 'メールの送信に失敗しました。',
          status: res.status === 200 ? 'success' : 'warning',
          position: 'top-right',
        });
      }
      reset();
      setIsFormSent(true);
    } catch (error) {
      console.error(error);
      toast({
        title: 'メールの送信に失敗しました。\n再度送信してください。',
        status: 'error',
        position: 'top-right',
      });
    }
    setLoading(false);
  };

  // 現在の日付から今年・今月を取得
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 月は 0〜11 なので +1

  // 翌月の日付を計算（12月の場合は翌年の1月に）
  const nextMonthDate = new Date(currentYear, now.getMonth() + 1, 1);
  const nextYear = nextMonthDate.getFullYear();
  const nextMonth = nextMonthDate.getMonth() + 1;

  // 対象のコレクション名を生成
  const openDayList = [
    `openDay_${currentYear}_${currentMonth}`,
    `openDay_${nextYear}_${nextMonth}`,
  ];

  const getOpenDayInfo = async (openDay: string) => {
    try {
      const response = await axios.get('/api/booking/fetchOpenDays', {
        params: { collectionName: openDay },
      });
      console.log(response);

      setOpenDays((prev) => {
        if (prev === null) {
          return [response.data.date];
        } else {
          return [...prev, response.data.date];
        }
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    for (let d in openDayList) {
      setOpenDays((prev) => {
        if (prev === null) {
          return [d];
        } else {
          return [...prev, d];
        }
      });
    }
  }, [openDayList]);

  const onSubmit: SubmitHandler<FormValues> = async (formData: FormValues) => {
    setLoading(true);
    console.log('送信データ：', formData);

    // メール送信の API を呼び出す
    await sendMail(formData);

    setLoading(false);
  };

  return (
    <>
      <div className="h-screen">
        <NextSeo
          title="コードアドベンチャー姪浜校"
          description="This is a special page description."
          canonical="https://example.com/special-page"
          openGraph={{
            url: 'https://alt-prime.com/ca_form',
            title: 'コードアドベンチャー体験会フォーム',
            description:
              '福岡市西区の小学生向けマイクラプログラミング教室の体験会申し込みフォームです。',
            images: [
              {
                url: 'https://example.com/images/special-page.jpg',
                width: 800,
                height: 600,
                alt: 'Special Page Image',
              },
            ],
            site_name: 'MyApplication',
          }}
        />
        <div className="flex flex-col items-center bg-indigo-100 py-10">
          <div className="">
            <Image src="/logo/ca.png" width={300} height={80} alt="プライム" />
          </div>

          <h2 className="my-6 text-center text-3xl font-bold">
            コードアドベンチャー姪浜校
            <br />
            体験会応募フォーム
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow"
          >
            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block font-medium">
                メールアドレス（必須）
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded border p-2"
                {...register('email', { required: 'メールアドレスは必須です' })}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* 希望日 第一希望 */}
            <div>
              <label htmlFor="firstChoice" className="block font-medium">
                希望日 第一希望
              </label>
              <select
                id="firstChoice"
                className="w-full rounded border p-2"
                {...register('firstChoice', { required: '第一希望を選択してください' })}
              >
                <option value="">選択してください</option>
                {timeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.firstChoice && (
                <p className="text-sm text-red-500">{errors.firstChoice.message}</p>
              )}
            </div>

            {/* 希望日 第二希望 */}
            <div>
              <label htmlFor="secondChoice" className="block font-medium">
                希望日 第二希望
              </label>
              <select
                id="secondChoice"
                className="w-full rounded border p-2"
                {...register('secondChoice', { required: '第二希望を選択してください' })}
              >
                <option value="">選択してください</option>
                {timeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.secondChoice && (
                <p className="text-sm text-red-500">{errors.secondChoice.message}</p>
              )}
            </div>

            {/* 生徒氏名 */}
            <div>
              <label htmlFor="studentName" className="block font-medium">
                生徒氏名
              </label>
              <input
                id="studentName"
                type="text"
                className="w-full rounded border p-2"
                {...register('studentName')}
              />
            </div>

            {/* 生徒氏名カナ */}
            <div>
              <label htmlFor="studentKana" className="block font-medium">
                生徒氏名カナ
              </label>
              <input
                id="studentKana"
                type="text"
                className="w-full rounded border p-2"
                {...register('studentKana')}
              />
            </div>

            {/* お子様の学年 */}
            <div>
              <label htmlFor="grade" className="block font-medium">
                お子様の学年
              </label>
              <select
                id="grade"
                className="w-full rounded border p-2"
                {...register('grade', { required: '学年を選択してください' })}
              >
                <option value="">選択してください</option>
                {gradeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.grade && <p className="text-sm text-red-500">{errors.grade.message}</p>}
            </div>

            {/* 電話番号 */}
            <div>
              <label htmlFor="phone" className="block font-medium">
                電話番号
              </label>
              <input
                id="phone"
                type="tel"
                className="w-full rounded border p-2"
                {...register('phone')}
              />
            </div>

            {/* ご要望・ご相談 */}
            <div>
              <label htmlFor="inquiry" className="block font-medium">
                ご要望やご相談がありましたらご入力ください。
              </label>
              <textarea
                id="inquiry"
                className="w-full rounded border p-2"
                rows={4}
                {...register('inquiry')}
              />
            </div>

            {/* 同意チェックボックス */}
            <div className="rounded border bg-gray-50 p-4">
              <p className="mb-2">
                ■このフォームから申請頂いた時点では予約は完了していません。
                <br />
                後ほど担当の者(ca.osumitsuki@gmail.com)から、ご回答いただいたメールアドレスにご連絡いたします。
                <br />
                ＊キャリアメール（携帯電話会社のメール）アドレスをご登録の場合、メールが届かない場合がございます。Gmail等のPCメールアドレスのご利用をお勧めいたします。
              </p>
              <div className="flex items-center">
                <input
                  id="agree"
                  type="checkbox"
                  className="mr-2"
                  {...register('agree', { required: '内容を確認してください' })}
                />
                <label htmlFor="agree" className="font-medium">
                  内容を確認しました
                </label>
              </div>
              {errors.agree && <p className="text-sm text-red-500">{errors.agree.message}</p>}
            </div>

            <ButtonOriginal
              label="送信する"
              loading={loading}
              className="w-full !bg-indigo-600 font-bold text-white"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
