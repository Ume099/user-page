import { ItemReturn } from '@/lib/invoice';

type ReportObj = {
  stageName: string;
  topic: string;
  detail: string;
};

type TeachingReportData = {
  studentUid: string;
  date: Date;
  classTime: string;
  stage: string;
  topic: string;
  detail: string;
  studentName: string;
  writer: string;
  writerUid: string;
  rikaido: string;
  comment: string;
  isPublished: boolean;
};

type UserData = {
  uid: string;
  name?: string;
  email?: string;
  displayName?: string;
};

const DEFAULT_REPORT_OBJ: ReportObj = {
  stageName: '',
  topic: '',
  detail: '',
};

type Props = {
  totalPrice: number;
  items: ItemReturn;
};

const ItemCard = (props: Props) => {
  const { items, totalPrice } = props;

  return (
    <>
      {items.map((item) => (
        <div>
          <div className="gap grid grid-cols-3 border-b"></div>
          <div className="gap mx-4 mt-4 grid grid-cols-3">
            <p className="mx-4">項目</p>
            <p className="mx-4">詳細</p>
            <p className="mx-4">値段</p>
            <div>{item.komoku}</div>
            <div className="mx-4 text-start text-sm">{item.detail}</div>
            <div className="flex shrink-0 items-start pl-8">
              <p>{Number(item.price).toLocaleString()}円</p>
            </div>
          </div>
          <div className="mb-10 mr-10 mt-4 flex justify-end font-bold underline">
            合計：　￥{totalPrice.toLocaleString()}
          </div>
        </div>
      ))}
    </>
  );
};

export default ItemCard;
