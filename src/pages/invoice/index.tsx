import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import InvoiceCardFurikomi from '@/components/invoice/InvoiceCardFurikomi';
import { AuthGuard } from '@/feature/auth/component/AuthGuard/AuthGuard';
import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { formatInvoiceList, FormatInvoiceListReturn } from '@/lib/invoice';
import { TeachingReportTemplateInputType } from '@/lib/teachingReport';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { NextPage } from 'next';
import { useState } from 'react';
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
  const [invoiceInfo, setInvoiceInfo] = useState<FormatInvoiceListReturn[] | []>([]);
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

  const get2DNum = (number: number) => {
    return ('0' + number).slice(-2);
  };

  // fetchする関数
  const getInvoice = async (year: number, month: number, uid: string) => {
    try {
      const response = await axios.get('/api/invoice/fetchInvoice', {
        params: {
          collectionName: 'invoice',
          uid,
        },
      });
      setInvoiceInfo((prev) => [...prev, formatInvoiceList(response.data)]);
    } catch (error) {
      console.log(error);
    }
    console.log(invoiceInfo);
  };

  return (
    <AuthGuard>
      <div>
        {/* 月を設定するボタン */}
        <ButtonOriginal label="test" onClick={() => getInvoice(2024, 9, '2o5zqr777wbv')} />
        <div>
          <ul>
            {invoiceInfo.map((invoice, index) => (
              <li key={index}>
                <InvoiceCardFurikomi invoice={invoice} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AuthGuard>
  );
};

export default TeachingExample;
