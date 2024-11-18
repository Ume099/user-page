const obj = {
  fullName: {
    stringValue: '弓指璃乃佳',
    valueType: 'stringValue',
  },
  date: {
    stringValue: '2024_09_30',
    valueType: 'stringValue',
  },
  placeName: {
    stringValue: 'コードアドベンチャー姪浜校',
    valueType: 'stringValue',
  },
  account: {
    stringValue: "福岡市西区内浜1-3-29 レンタルスペースM's Kitchen内",
    valueType: 'stringValue',
  },
  TEL: {
    stringValue: '08082592682',
    valueType: 'stringValue',
  },
  mail: {
    stringValue: 'en.prime1@gmail.com',
    valueType: 'stringValue',
  },
  price: {
    integerValue: '8800',
    valueType: 'integerValue',
  },
  note: {
    stringValue: '引き落としは毎月２８日となります。 （休日の場合、翌営業日となります）',
    valueType: 'stringValue',
  },
  payment: {
    stringValue: '銀行振込',
    valueType: 'stringValue',
  },
  dueDate: {
    stringValue: '2024_10_4',
    valueType: 'stringValue',
  },
  item: {
    arrayValue: {
      values: [
        {
          mapValue: {
            fields: {
              komoku: {
                stringValue: '授業料（お試し入会）',
                valueType: 'stringValue',
              },
              price: {
                integerValue: '8800',
                valueType: 'integerValue',
              },
              detail: {
                stringValue: 'プログラミング（通常コース）',
                valueType: 'stringValue',
              },
            },
          },
          valueType: 'mapValue',
        },
      ],
    },
    valueType: 'arrayValue',
  },
  isChecked: {
    booleanValue: false,
    valueType: 'booleanValue',
  },
  isPublished: {
    booleanValue: false,
    valueType: 'booleanValue',
  },
};

type ValueType =
  | { stringValue: string; valueType: 'stringValue' }
  | { integerValue: string; valueType: 'integerValue' }
  | { booleanValue: boolean; valueType: 'booleanValue' }
  | { arrayValue: { values: MapValueType[] }; valueType: 'arrayValue' }
  | { mapValue: { fields: Record<string, ValueType> }; valueType: 'mapValue' };

type MapValueType = {
  accountInfo: { stringValue: string; valueType: 'stringValue' };
  komoku: { stringValue: string; valueType: 'stringValue' };
  price: { integerValue: string; valueType: 'integerValue' };
  detail: { stringValue: string; valueType: 'stringValue' };
};

export type ItemReturn = { komoku: string; price: number; detail: string }[];

export type FormatInvoiceListReturn = {
  fullName: string;
  placeName: string;
  date: string;
  account?: string;
  TEL: string;
  mail: string;
  totalPrice: number;
  note: string;
  payment: string;
  dueDate: string;
  item: ItemReturn;
};

type FieldValue = {
  stringValue?: string;
  integerValue?: string;
  booleanValue?: boolean;
  valueType: 'stringValue' | 'integerValue' | 'booleanValue' | 'mapValue' | 'arrayValue';
};

type MapFields = {
  accountInfo: FieldValue;
  komoku: FieldValue;
  price: FieldValue;
  detail: FieldValue;
};

type MapValue = {
  mapValue: {
    fields: MapFields;
  };
  valueType?: 'mapValue';
};

type arrayValue = { values: MapValue[] };

type ObjType = {
  fullName: { stringValue: string; valueType: 'stringValue' };
  date: { stringValue: string; valueType: 'stringValue' };
  placeName: { stringValue: string; valueType: 'stringValue' };
  account: { stringValue: string; valueType: 'stringValue' };
  TEL: { stringValue: string; valueType: 'stringValue' };
  mail: { stringValue: string; valueType: 'stringValue' };
  totalPrice: { integerValue: number; valueType: 'integerValue' };
  note: { stringValue: string; valueType: 'stringValue' };
  payment: { stringValue: string; valueType: 'stringValue' };
  dueDate: { stringValue: string; valueType: 'stringValue' };
  item: { arrayValue: arrayValue };
  isChecked: { booleanValue: boolean; valueType: 'booleanValue' };
  isPublished: { booleanValue: boolean; valueType: 'booleanValue' };
};

export const formatInvoiceList = (data: ObjType): FormatInvoiceListReturn => {
  const obj = {
    fullName: data.fullName.stringValue,
    date: data.date.stringValue,
    placeName: data.placeName.stringValue,
    TEL: data.TEL.stringValue,
    mail: data.mail.stringValue,
    totalPrice: data.totalPrice?.integerValue || 0,
    note: data.note.stringValue,
    payment: data.payment.stringValue,
    dueDate: data.dueDate.stringValue,
    item: data.item.arrayValue.values.map((value: MapValue) => ({
      accountInfo: value.mapValue.fields.accountInfo?.stringValue || '',
      komoku: value.mapValue.fields.komoku?.stringValue || '',
      price: value.mapValue.fields.price?.integerValue || '',
      detail: value.mapValue.fields.detail?.stringValue || '',
    })),
  };

  return obj;
};

export type InvoiceInput = {
  fullName: string;
  placeName?: string;
  date: string;
  account?: string;
  TEL?: string;
  mail?: string;
  totalPrice: number;
  note?: string;
  payment: string;
  dueDate: string;
  items: ItemReturn;
};

export type InvoiceListAll = {
  id: string;
  date: string;
  uid: string;
  isChecked: boolean;
  mail: string;
  totalPrice: number | string;
  isPublished: boolean;
  dueDate: string;
  fullName: string;
  TEL: string;
  payment: string | null;
  placeName: string;
  items: { komoku: string; price: number; detail: string }[] | null;
}[];

// データをFormatInvoiceListReturn型に変換する関数
export function formatInvoiceListAll(invoiceList: InvoiceListAll): FormatInvoiceListReturn {
  return invoiceList.map((invoice) => {
    // totalPriceが空文字列の場合は0として扱う
    const totalPrice =
      typeof invoice.totalPrice === 'string' && invoice.totalPrice === ''
        ? 0
        : Number(invoice.totalPrice);

    // paymentがnullの場合、デフォルト値として"未設定"を入れる
    const payment = invoice.payment || '未設定';

    // itemsがnullの場合は空配列にする
    const items: ItemReturn = invoice.items ? invoice.items : [];

    return {
      uid: invoice.uid,
      fullName: invoice.fullName,
      placeName: invoice.placeName,
      date: invoice.date,
      TEL: invoice.TEL,
      mail: invoice.mail,
      totalPrice: totalPrice,
      isPublished: invoice.isPublished,
      isChecked: invoice.isChecked,
      payment: payment,
      dueDate: invoice.dueDate,
      items: items,
    };
  });
}

export const DETAIL_LIST = ['通常コース', '隔週コース', '中高生コース', '', ''];

export const PAMENT_OBJ_LIST = [
  { label: '銀行振込', value: '銀行振込' },
  { label: '口座振替', value: '口座振替' },
  { label: '福岡市習い事クーポン', value: '福岡市習い事クーポン' },
];

export const KOMOKU_LIST = ['入会金', '授業料', '', 'その他'];
