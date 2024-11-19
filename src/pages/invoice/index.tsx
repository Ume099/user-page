import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import InvoiceCardFurikomi from '@/components/invoice/InvoiceCardFurikomi';
import InvoiceCardFurikae from '@/components/invoice/InvoiceCardFurikae';
import YearDropdown from '@/components/invoice/parts/YearDropdown';
import { AuthGuard } from '@/feature/auth/component/AuthGuard/AuthGuard';
import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { formatInvoiceList, FormatInvoiceListReturn } from '@/lib/invoice';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

const thisYear = new Date().getFullYear();

const Invoice: NextPage = () => {
  const [invoiceInfo, setInvoiceInfo] = useState<FormatInvoiceListReturn>([]);
  const [year, setYear] = useState<Number>(thisYear);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [userInfo] = useRecoilState<UserInfo>(userInfoState);
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
      if (response) {
        toast({ title: '請求書を取得しました', status: 'success', position: 'top-right' });
      }
    } catch (error) {
      if (!isFirstLoad) {
        toast({ title: '請求書が存在しません。', status: 'error', position: 'top-right' });
      }
      console.log(error);
    }
  };

  useEffect(() => {
    getInvoice(userInfo.uid);
    setIsFirstLoad(false);
  }, [year]);

  return (
    <AuthGuard>
      <div>
        {/* 月を設定するボタン */}
        <YearDropdown setYear={setYear} />
        {!invoiceInfo && (
          <ButtonOriginal
            className="my-4 w-full"
            variant="primary"
            label="請求書情報を取得"
            onClick={() => getInvoice(userInfo.uid)}
          />
        )}
        <div>
          <ul>
            {invoiceInfo.map((invoice, index) => (
              <li key={index}>
                {invoice.payment === '銀行振込' ? (
                  <InvoiceCardFurikomi invoice={invoice} />
                ) : (
                  <InvoiceCardFurikae invoice={invoice} />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Invoice;
