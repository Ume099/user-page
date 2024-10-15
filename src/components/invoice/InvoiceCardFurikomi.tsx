import { FormatInvoice } from '@/lib/invoice';
import ItemCard from './parts/ItemCard';

type Props = {
  invoice: FormatInvoice;
};

const InvoiceCardFurikomi = (props: Props) => {
  const { invoice } = props;

  const totalPrice = invoice.totalPrice;

  return (
    <div className="w-full max-w-4xl items-center p-2">
      {invoice.isPublished && invoice.isChecked && (
        <div className="h-full w-full border px-4 lg:p-10">
          <div className="my-10 flex items-center rounded border border-primary py-4 text-center">
            <p className="mx-auto text-4xl">請求書</p>
          </div>
          <div className="flex w-full justify-end">
            <p className="inline-block">
              発行日：　{invoice.date.replace('_', '年').replace('_', '月')}日
            </p>
          </div>
          <div className="text-l mt-4 flex font-bold underline">
            生徒氏名：　<span>{invoice.fullName}　</span>
            <span> 様</span>
          </div>
          <div className="flex justify-between gap-x-5">
            <div className="">
              <div className="mt-4 rounded border border-primary p-2 lg:pr-40">
                下記の通りご請求申し上げます。
              </div>
              <p className="lg:text-l mt-4 text-sm font-bold underline">
                ご請求金額：　{totalPrice || 0}　円
              </p>
              <div className="mt-4 rounded border border-primary p-2">
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
              <div className="flex h-full w-full justify-end">
                <div className="mt-4 rounded border border-primary p-1">
                  コードアドベンチャー福岡姪浜校 <br />
                  〒819-0005 <br /> 福岡市西区内浜1-3-29 <br /> レンタルスペースM's Kitchen内 <br />
                  TEL：{invoice.TEL} <br /> Mail：{invoice.mail}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 inline-block">
            お支払期限：　
            <span className="font-bold">
              {invoice.dueDate.replace('_', '年').replace('_', '月')}日
            </span>
          </p>
          <div className="mt-4">
            <div className="mb-4 flex justify-start">
              <p>お支払い方法：</p>
              <p className="font-bold">銀行振込</p>
            </div>
            <ItemCard items={invoice.items} totalPrice={totalPrice || 0} />
            <div className="mb-10 mr-10 mt-4 flex justify-end font-bold underline">
              合計：　￥{invoice.totalPrice.toLocaleString()}
            </div>
          </div>
        </div>
      )}
      {/* ユーザーデータの表示 */}
    </div>
  );
};

export default InvoiceCardFurikomi;
