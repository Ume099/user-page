import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { TeachingReportTemplateInputType } from '@/lib/teachingReport';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import useSWR from 'swr';

type ReportObj = {
  stageName: string;
  topic: string;
  detail: string;
};

type TeachingReportData = {
  studentUid: string;
  date: Date;
  classTime: string;
  stage: string;
  topic: string;
  detail: string;
  studentName: string;
  writer: string;
  writerUid: string;
  rikaido: string;
  comment: string;
  isPublished: boolean;
};

type UserData = {
  uid: string;
  name?: string;
  email?: string;
  displayName?: string;
};

const DEFAULT_REPORT_OBJ: ReportObj = {
  stageName: '',
  topic: '',
  detail: '',
};

// fetcher関数を定義
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const TeachingExample: NextPage = () => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeachingReportTemplateInputType>();
  const [userInfo] = useRecoilState<UserInfo>(userInfoState);
  const toast = useToast();
  const stage = watch('stage');

  // useSWRを使ってテンプレートデータをフェッチ
  const { data: reportObj = DEFAULT_REPORT_OBJ, error: templateError } = useSWR<ReportObj>(
    stage ? `/api/teachingReport/fetchTemplate?docId=stage${stage}` : null,
    fetcher,
  );

  // useSWRを使ってユーザーデータをフェッチ
  const { data: users, error: usersError } = useSWR<UserData[]>(
    '/api/userActions/fetchUsers',
    fetcher,
  );

  const getPostData = (): TeachingReportData => {
    const data: TeachingReportData = {
      date: watch('date'),
      classTime: watch('classTime'),
      stage: reportObj.stageName,
      topic: reportObj.topic,
      detail: reportObj.detail,
      studentUid: watch('studentUid'),
      studentName: String((users && users[1].displayName) || ''),
      writer: userInfo.userName || 'なし',
      writerUid: userInfo.uid,
      rikaido: watch('rikaido'),
      comment: watch('comment') || 'なし',
      isPublished: false,
    };
    return data;
  };

  const createTeachingReport = async (data: TeachingReportData) => {
    try {
      // エンドポイントに POST リクエストを送信
      const response = await axios.post('/api/teachingReport/createReport', data);

      if (response.status === 201) {
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error('Error while creating document:', error);
      return { success: false, message: 'An error occurred while creating the document.' };
    }
  };

  // 提出の関数
  const onSubmit = () => {
    if (!watch('stage') || !watch('date')) {
      toast({
        title: '必要事項を選択してください。',
        status: 'error',
        position: 'top',
      });
      return;
    }
    createTeachingReport(getPostData());
    reset();
  };

  // エラーハンドリング
  if (templateError) {
    console.log('Error fetching template data:', templateError);
  }
  console.log('users', users);

  if (usersError) {
    console.log('Error fetching users:', usersError);
  }
  const fullName = '弓指璃乃佳';

  // TODO: 以下を変える
  if (userInfo.uid === '') {
    return (
      <div className="mt-24 max-w-4xl items-center w-full p-2">
        {/* ユーザーデータの表示 */}
        <div className="border w-full h-full px-4 lg:p-10">
          <div className="flex border-primary rounded border my-10 py-4 items-center text-center">
            <p className="text-4xl mx-auto">請求書</p>
          </div>
          <div className="flex justify-end w-full">
            <p className="inline-block">2024年09月30日</p>
          </div>
          <div className="flex text-l font-bold underline">
            生徒氏名：　<span>弓指璃乃佳　</span>
            <span> 様</span>
          </div>
          <div className="flex justify-between gap-x-5">
            <div className="">
              <div className="mt-4 border-primary lg:pr-40 rounded border p-2">
                下記の通りご請求申し上げます。
              </div>
              <p className="mt-4 text-sm lg:text-l font-bold underline">ご請求金額：　8,800　円</p>
              <div className="mt-4 border-primary rounded border p-2">
                【口座情報】
                <br /> 西日本シティ銀行
                <br />
                大橋駅前支店[735]
                <br />
                普通
                <br />
                3034698 ｽﾐ ﾄｼﾔ
              </div>
            </div>
            <div>
              <div className="flex w-full justify-end h-full">
                <div className="border-primary rounded border mt-4 p-1">
                  コードアドベンチャー福岡姪浜校 <br />
                  〒819-0005 <br /> 福岡市西区内浜1-3-29 <br /> レンタルスペースM's Kitchen内 <br />
                  TEL：080-7620-5760 <br /> Mail：ca.osumitsuki@gmail.com
                </div>
              </div>
            </div>
          </div>
          <p className="inline-block mt-4">
            お支払期限：　<span className="font-bold">2024年10月5日(土)</span>
          </p>
          <div className="ml-10 mt-4">
            <p>お支払い方法：</p>
            <p className="font-bold">銀行振込</p>
            <div>
              <div className="grid-cols-3 gap grid border-b">
                <p className="mx-4">項目</p>
                <p className="mx-4">詳細</p>
                <p className="mx-4">値段</p>
              </div>
              <div className="mt-4 mx-4 w-full grid-cols-3 gap grid">
                <div>授業料</div>
                <div className="text-sm mx-4 text-start">プログラミング（通常コース）</div>
                <div className="flex w-full shrink-0">
                  <p className="inline-block">8,000円</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end mr-10 font-bold underline mb-10">
                合計：　￥8,800
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div>請求書はありません。</div>;
};

export default TeachingExample;
