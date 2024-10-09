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

// itemsの型定義
export type Item = {
  komoku: string;
  price: number;
  detail: string;
};

// dataの型定義
export type Data = {
  date: string;
  uid: string;
  isCkecked: boolean;
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
  fullName: string;
  placeName: string;
  date: string;
  account?: string;
  TEL: string;
  mail: string;
  totalPrice: number;
  note?: string;
  payment: string;
  dueDate: string;
  items: ItemReturn;
};

export type FormatInvoiceListReturn = FormatInvoice[];

// 変換関数の実装
export const formatInvoiceList = (obj: InvoiceList): FormatInvoiceListReturn => {
  return obj.map((invoice) => ({
    fullName: invoice.data.fullName,
    placeName: invoice.data.placeName,
    date: invoice.data.date,
    account: invoice.data.uid || undefined, // accountはuidを使用するか、存在しない場合undefined
    TEL: invoice.data.TEL,
    mail: invoice.data.mail,
    totalPrice: invoice.data.totalPrice,
    note: invoice.data.isPublished ? 'Published' : 'Not Published', // 任意のフィールドを使用
    payment: invoice.data.payment || 'Unpaid', // paymentがnullの場合、'Unpaid'と表示
    dueDate: invoice.data.dueDate,
    items: invoice.data.items?.map((item: any) => ({
      komoku: item.komoku,
      price: item.price,
      detail: item.detail,
    })) || [{ komoku: '', price: 0, detail: '' }],
  }));
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
