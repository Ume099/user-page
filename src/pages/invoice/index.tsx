import ButtonOriginal from '@/components/common/parts/ButtonOriginal';
import InvoiceCardFurikomi from '@/components/invoice/InvoiceCardFurikomi';
import YearDropdown from '@/components/invoice/parts/YearDropdown';
import { AuthGuard } from '@/feature/auth/component/AuthGuard/AuthGuard';
import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { formatInvoiceList, FormatInvoiceListReturn } from '@/lib/invoice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

type UserData = {
  uid: string;
  name?: string;
  email?: string;
  displayName?: string;
};

const thisYear = new Date().getFullYear();

// fetcher関数を定義
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Page: NextPage = () => {
  const [invoiceInfo, setInvoiceInfo] = useState<FormatInvoiceListReturn>([]);
  const [year, setYear] = useState<Number>(thisYear);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [userInfo] = useRecoilState<UserInfo>(userInfoState);

  // 請求書のデータをfetchする関数
  const getInvoice = async (uid: string) => {
    try {
      const response: any = await axios.get('/api/invoice/fetchInvoice', {
        params: {
          collectionName: 'invoice',
          docId: `${uid}_${year}`,
        },
      });
      console.log(response.data);
      setInvoiceInfo(formatInvoiceList(response.data));
      if (response) {
        toast.success('請求書を取得しました', {
          position: 'top-right',
        });
      }
    } catch (error) {
      if (!isFirstLoad) {
        toast.error('請求書が存在しません。', {
          position: 'top-right',
        });
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
        {!invoiceInfo.length && (
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
                <InvoiceCardFurikomi invoice={invoice} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Page;
