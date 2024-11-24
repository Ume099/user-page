import { useEffect, useState } from 'react';
import InfoMessage, { STATUS_LIST } from './parts/InfoMessage';
import useSWR from 'swr';
import { getApi } from '@/lib/util/fetcher';

type MessageArea = {
  isValid: boolean;
  message: string;
  status: string;
};

const HeaderInfo = () => {
  const { data: messageArea } = useSWR<MessageArea>('/api/messageArea/getMessageArea', getApi);
  const [message, setMessage] = useState(messageArea?.message ?? '');
  console.log(messageArea?.message);

  useEffect(() => {
    setMessage(messageArea?.message ?? '');
  }, [messageArea]);

  return (
    <>
      {message && messageArea?.isValid && (
        <div className="flex h-full justify-center text-center">
          <InfoMessage
            message={message}
            status={(messageArea?.status as (typeof STATUS_LIST)[number]) || 'info'}
          />
        </div>
      )}
    </>
  );
};

export default HeaderInfo;
