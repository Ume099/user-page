export type ReqBody<T> = {
  method: string;
  headers: object;
  body: T;
};

// お問い合わせページ用の API が受け取るパラメータ
export type TeachingReportMail = {
  name: string;
  sendTo: string;
  year: number;
  month: number;
  date: number;
};
