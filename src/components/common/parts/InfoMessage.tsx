export const STATUS_LIST = ['info', 'success', 'warning', 'error'] as const;
import { FaInfoCircle } from 'react-icons/fa';

type Props = {
  message: string;
  status: (typeof STATUS_LIST)[number];
};

const InfoMessage = (props: Props): JSX.Element => {
  const { message, status } = props;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case STATUS_LIST[0]:
        return 'green-200';
      case STATUS_LIST[1]:
        return 'green';
      case STATUS_LIST[2]:
        return 'green';
      case STATUS_LIST[3]:
        return 'green';
      default:
        return '';
    }
  };

  return (
    <div
      className={`mx-auto flex h-full w-80 justify-start py-2 align-middle ${
        'bg-' + getStatusColor(status)
      }`}
    >
      {/* icon */}
      <div className="flex items-center justify-center px-4">
        <Icon status={status} />
      </div>
      {/* message */}
      <p>{message}</p>
    </div>
  );
};

export default InfoMessage;

type StatusIconProps = {
  status: Props['status'];
};

const Icon = (props: StatusIconProps): JSX.Element => {
  const { status } = props;
  switch (status) {
    case STATUS_LIST[0]:
      return <FaInfoCircle />;
    case STATUS_LIST[1]:
      return <div>{STATUS_LIST[1]}</div>;
    case STATUS_LIST[2]:
      return <div>{STATUS_LIST[2]}</div>;
    case STATUS_LIST[3]:
      return <div>{STATUS_LIST[3]}</div>;
  }
  return <div>icon</div>;
};
