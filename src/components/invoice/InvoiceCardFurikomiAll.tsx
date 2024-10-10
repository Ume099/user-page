import { FormatInvoice } from '@/lib/invoice';
import { useState } from 'react';
import ButtonOriginal from '../common/parts/ButtonOriginal';
import ItemCard from './parts/ItemCard';
import ToggleSwitchCheck from './parts/ToggleSwitchCheck';
import ToggleSwitchPublish from './parts/ToggleSwitchPublish';

type Props = {
  invoice: FormatInvoice;
  defaultOpen: boolean;
};

const InvoiceCardFurikomiAll = (props: Props) => {
  const { invoice, defaultOpen = false } = props;

  const [open, setOpen] = useState(defaultOpen);

  const totalPrice = invoice.totalPrice;

  return (
    <div className="max-w-4xl items-center w-full p-2">
      {!open ? (
        <div className="flex justify-center mt-4">
          <div className=" border p-4 rounded-lg w-60 flex justify-start">
            <div className="pt-2">
              <div className="flex">
                <label htmlFor={`${invoice.uid}_${invoice.date}`}>チェック→</label>
                <ToggleSwitchCheck
                  isDefaultChecked={invoice.isChecked}
                  id={`${invoice.uid}_${invoice.date}`}
                />
                <label htmlFor={`${invoice.uid}_${invoice.date}`}>公開→</label>
                <ToggleSwitchPublish
                  isDefaultPublished={invoice.isPublished}
                  id={`${invoice.uid}_${invoice.date}`}
                />
              </div>
              <ButtonOriginal onClick={() => setOpen((prev) => !prev)} label="詳細" />
              <div className="font-bold text-2xl mt-2">{invoice.fullName}</div>
              <ul className="flex">
                {invoice.items.map((item, index) => (
                  <li key={index}>
                    {item.komoku}
                    {invoice.items[index + 1] && <span className="mr-2">,</span>}
                  </li>
                ))}
              </ul>
              <div className="flex gap-x-2">
                <p>{invoice.totalPrice}</p>
                <span>円</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border w-full h-full px-4 lg:p-10">
          <ButtonOriginal onClick={() => setOpen((prev) => !prev)} label="閉じる" />{' '}
          <ToggleSwitchCheck
            isDefaultChecked={invoice.isChecked}
            id={`${invoice.uid}_${invoice.date}`}
          />
          <label htmlFor={`${invoice.uid}_${invoice.date}`}>
            ⇑確認したらチェックをお願いします。
          </label>
          <div className="flex border-primary rounded border my-10 py-4 items-center text-center">
            <p className="text-4xl mx-auto">請求書</p>
          </div>
          <div className="flex justify-end w-full">
            <p className="inline-block">
              発行日：　{invoice.date.replace('_', '年').replace('_', '月')}日
            </p>
          </div>
          <div className="mt-4 flex text-l font-bold underline">
            生徒氏名：　<span>{invoice.fullName}　</span>
            <span> 様</span>
          </div>
          <div className="flex justify-between gap-x-5">
            <div className="">
              <div className="mt-4 border-primary lg:pr-40 rounded border p-2">
                下記の通りご請求申し上げます。
              </div>
              <p className="mt-4 text-sm lg:text-l font-bold underline">
                ご請求金額：　{totalPrice || 0}　円
              </p>
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
                  TEL：{invoice.TEL} <br /> Mail：{invoice.mail}
                </div>
              </div>
            </div>
          </div>
          <p className="inline-block mt-4">
            お支払期限：　
            <span className="font-bold">
              {invoice.dueDate.replace('_', '年').replace('_', '月')}日
            </span>
          </p>
          <div className="mt-4">
            <div className="flex mb-4 justify-start">
              <p>お支払い方法：</p>
              <p className="font-bold">銀行振込</p>
            </div>
            <ItemCard items={invoice.items} totalPrice={totalPrice || 0} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceCardFurikomiAll;
