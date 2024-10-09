import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import InvoiceCardFurikomi from '@/components/invoice/InvoiceCardFurikomi';
import YearDropdown from '@/components/invoice/parts/YearDropdown';
import { AuthGuard } from '@/feature/auth/component/AuthGuard/AuthGuard';
import { formatInvoiceListAll, FormatInvoiceListReturn } from '@/lib/invoice';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { NextPage } from 'next';
import { useState } from 'react';

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

const thisYear = new Date().getFullYear();
const TeachingExample: NextPage = () => {
  const [invoiceInfo, setInvoiceInfo] = useState<FormatInvoiceListReturn>([]);
  const [year, setYear] = useState<number>(thisYear);
  const toast = useToast();

  // fetchする関数
  const getInvoice = async (year: number) => {
    try {
      const response = await axios.get('/api/invoice/fetchInvoiceAll', {
        params: {
          collectionName: 'invoice',
          docId: `${year}`,
        },
      });
      console.log(response.data);
      setInvoiceInfo(formatInvoiceListAll(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthGuard>
      <div>
        {/* 月を設定するボタン */}
        <ButtonOriginal label="test" onClick={() => getInvoice(year)} />
        <YearDropdown setYear={setYear} />
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
