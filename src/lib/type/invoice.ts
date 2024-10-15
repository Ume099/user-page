export type ReqBody<T> = {
  method: string;
  headers: object;
  body: T;
};

// お問い合わせページ用の API が受け取るパラメータ
export type InvoiceMailParams = {
  name: string;
  sendTo: string;
  year: number;
  month: number;
};

// お問い合わせページ用の API が受け取るパラメータ
export type PartnerContactFormParam = {
  name: string;
  email: string;
  tel: string;
  company: string;
  body?: string;
};
