import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import InvoiceCardFurikomi from '@/components/invoice/InvoiceCardFurikomi';
import YearDropdown from '@/components/invoice/parts/YearDropdown';
import { AuthGuard } from '@/feature/auth/component/AuthGuard/AuthGuard';
import { formatInvoiceList, FormatInvoiceListReturn } from '@/lib/invoice';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { NextPage } from 'next';
import { useState } from 'react';

type UserData = {
  uid: string;
  name?: string;
  email?: string;
  displayName?: string;
};

const thisYear = new Date().getFullYear();

// fetcher関数を定義
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const TeachingExample: NextPage = () => {
  const [invoiceInfo, setInvoiceInfo] = useState<FormatInvoiceListReturn>([]);
  const [year, setYear] = useState<Number>(thisYear);
  const toast = useToast();

  // 請求書のデータをfetchする関数
  const getInvoice = async (uid: string) => {
    try {
      const response = await axios.get('/api/invoice/fetchInvoice', {
        params: {
          collectionName: 'invoice',
          docId: `${uid}_${year}`,
        },
      });
      console.log(response.data);
      setInvoiceInfo(formatInvoiceList(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthGuard>
      <div>
        {/* 月を設定するボタン */}
        <ButtonOriginal label="test" onClick={() => getInvoice('KZlzeAudgBVPawzaQuT7zo4BLCH3')} />
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
