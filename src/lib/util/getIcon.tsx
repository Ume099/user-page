import { FaHome } from 'react-icons/fa';
import { FaRegPenToSquare } from 'react-icons/fa6';
import { LiaFileInvoiceDollarSolid } from 'react-icons/lia';
import { MdEditCalendar } from 'react-icons/md';
import { RiAdminLine } from 'react-icons/ri';
import { ReactElement } from 'rehype-react/lib';

export const getIcon = (title: string): ReactElement => {
  switch (title) {
    case 'HOME':
      return <FaHome className="mr-4 w-4 scale-[200%]" />;
    case '指導報告書':
      return <FaRegPenToSquare className="mr-4 w-4 scale-[200%]" />;
    case '予定確認・変更':
      return <MdEditCalendar className="mr-4 w-4 scale-[200%]" />;
    case '請求書':
      return <LiaFileInvoiceDollarSolid className="mr-4 w-4 scale-[200%]" />;
    default:
      return <RiAdminLine className="mr-4 w-4 scale-[200%]" />;
  }
};
