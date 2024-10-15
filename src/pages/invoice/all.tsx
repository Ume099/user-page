import InvoiceCardFurikomiAll from '@/components/invoice/InvoiceCardFurikomiAll';
import YearAndMonthDropdown from '@/components/invoice/parts/YearAndMonthDropdown';
import { AuthGuard } from '@/feature/auth/component/AuthGuard/AuthGuard';
import { formatInvoiceListAll, FormatInvoiceListReturn } from '@/lib/invoice';
import axios from 'axios';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // 変更

const thisYear = new Date().getFullYear();
const thisMonth = new Date().getMonth();

const TeachingExample: NextPage = () => {
  const [invoiceInfo, setInvoiceInfo] = useState<FormatInvoiceListReturn>([]);
  const [year, setYear] = useState<number>(thisYear);
  const [month, setMonth] = useState<number>(thisMonth + 1);

  // fetchする関数
  const getInvoice = async () => {
    try {
      const response = await axios.get('/api/invoice/fetchInvoiceAll', {
        params: {
          collectionName: 'invoice',
          docId: `${year}_${('0' + month).slice(-2)}`,
        },
      });
      console.log(response.data);
      setInvoiceInfo(formatInvoiceListAll(response.data));
    } catch (error) {
      toast.error(`エラーが発生しました。${error}`);
      console.log(error);
    }
  };

  useEffect(() => {
    getInvoice();
  }, [year, month]);

  return (
    <AuthGuard>
      <div className="ml-8">
        {/* 月を設定するボタン */}
        <YearAndMonthDropdown setMonth={setMonth} setYear={setYear} />
        <div className="mt-4">
          <ul>
            {invoiceInfo.map((invoice, index) => (
              <li key={index}>
                <InvoiceCardFurikomiAll defaultOpen={false} invoice={invoice} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AuthGuard>
  );
};

export default TeachingExample;
