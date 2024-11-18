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

export type FormatInvoiceListReturn = FormatInvoice[];

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

// itemsの型定義
export type Item = {
  komoku: string;
  price: number;
  detail: string;
};

export type Data = {
  date: string;
  uid: string;
  isChecked: boolean;
  mail: string;
  totalPrice: number;
  isPublished: boolean;
  dueDate: string;
  fullName: string;
  TEL: string;
  payment: string | null;
  placeName: string;
  items: Item[] | null;
};

// 全体の型定義
export type Invoice = {
  id: string;
  data: Data;
};

// Invoiceの配列型定義
export type InvoiceList = Invoice[];

export type FormatInvoice = {
  uid: string;
  fullName: string;
  placeName: string;
  date: string;
  account?: string;
  TEL: string;
  mail: string;
  totalPrice: number;
  isPublished: boolean;
  isChecked: boolean;
  payment: string;
  dueDate: string;
  items: ItemReturn;
};

export const formatInvoiceList = (obj: InvoiceList): FormatInvoiceListReturn => {
  return obj.map((invoice) => ({
    uid: invoice.data.uid,
    fullName: invoice.data.fullName,
    placeName: invoice.data.placeName,
    date: invoice.data.date,
    account: invoice.data.uid || undefined, // accountはuidを使用するか、存在しない場合undefined
    TEL: invoice.data.TEL,
    mail: invoice.data.mail,
    totalPrice: invoice.data.totalPrice,
    isPublished: invoice.data.isPublished ?? false, // 任意のフィールドを使用
    isChecked: invoice.data.isPublished ?? false, // 任意のフィールドを使用
    payment: invoice.data.payment || 'Unpaid', // paymentがnullの場合、'Unpaid'と表示
    dueDate: invoice.data.dueDate,
    items: invoice.data.items?.map((item: any) => ({
      komoku: item.komoku,
      price: item.price,
      detail: item.detail,
    })) || [{ komoku: '', price: 0, detail: '' }],
  }));
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
  items: {
    komoku: string;
    price: number;
    detail: string;
  }[];
};

export const PAMENT_OBJ_LIST = [
  { label: '銀行振込', value: '銀行振込' },
  { label: '口座振替', value: '口座振替' },
  { label: '福岡市習い事クーポン', value: '福岡市習い事クーポン' },
];

export const KOMOKU_LIST = ['入会金', '授業料', '', 'その他'];
export const DETAIL_LIST = ['通常コース', '隔週コース', '中高生コース', '', ''];
