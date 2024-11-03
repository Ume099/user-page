export type ReqBody<T> = {
  method: string;
  headers: object;
  body: T;
};

// お問い合わせページ用の API が受け取るパラメータ
export type BookingChangeMailParam = {
  name?: String;
  sendTo: string;
  yearBefChange: number;
  monthBefChange: number;
  dateBefChange: number;
  classBefChange: String;
  yearAftChange: number;
  monthAftChange: number;
  dateAftChange: number;
  classAftChange: String;
};
