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
  items: ItemReturn;
};

const ItemCard = (props: Props) => {
  const { items } = props;

  const totalPrice = items.reduce((sum: number, currentItem) => {
    return sum + Number(currentItem.price);
  }, 0);

  return (
    <>
      {items.map((item) => (
        <div>
          <div className="grid-cols-3 gap grid border-b">
            <p className="mx-4">項目</p>
            <p className="mx-4">詳細</p>
            <p className="mx-4">値段</p>
          </div>
          <div className="mt-4 mx-4 grid-cols-3 gap grid">
            <div>{item.komoku}</div>
            <div className="text-sm mx-4 text-start">{item.detail}</div>
            <div className="flex shrink-0">
              <p>{Number(item.price).toLocaleString()}円</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end mr-10 font-bold underline mb-10">
            合計：　￥{totalPrice.toLocaleString()}
          </div>
        </div>
      ))}
    </>
  );
};

export default ItemCard;
