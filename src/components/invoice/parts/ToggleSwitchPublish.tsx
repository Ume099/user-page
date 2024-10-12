import { UserInfo, userInfoState } from '@/hooks/atom/userInfo';
import { InvoiceMailParams } from '@/lib/type/invoice';
import { getEmailByUid } from '@/lib/util/getUserInfo';
import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { useRecoilState } from 'recoil';

type ToggleProps = {
  label?: string;
  className?: string;
  register?: UseFormRegisterReturn<any>;
  id: string;
  isDefaultPublished: boolean;
  date: string;
  uid: string;
};

const ToggleSwitchPublish = (props: ToggleProps): JSX.Element => {
  const { label, className, register, id, isDefaultPublished, date, uid } = props;
  const [isPublished, setIsPublished] = useState(isDefaultPublished);
  const [userInfo] = useRecoilState<UserInfo>(userInfoState);

  const mailSender = async () => {
    const email = await getEmailByUid(uid);

    const year = Number(date.split('-')[0]);
    const month = Number(date.split('-')[1]);
    const data: InvoiceMailParams = {
      name: userInfo.userName || '',
      sendTo: email || '',
      year,
      month,
    };
    console.log('メール送信', data);

    const res = await fetch('api/invoice/sendMail', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.status === 200) console.log('メール送信成功');
  };

  const handleToggleIsPublished = async () => {
    await upDateIsPublished(true);
    setIsPublished(true);
    await mailSender();
  };

  const upDateIsPublished = async (isPublished: boolean) => {
    const res = await fetch('/api/invoice/updateIsPublished', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, isPublished }),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div className={`mb-4 flex w-full flex-col items-start gap-2 ${className}`}>
      <label
        className="flex shrink-0 items-start justify-between md:justify-between"
        htmlFor={label}
      >
        <span className="text-base">{label}</span>
      </label>
      <div className="w-full">
        <label className="inline-flex cursor-pointer items-center">
          <input
            id={label}
            type="checkbox"
            {...register}
            className="hidden"
            checked={isPublished}
            onChange={handleToggleIsPublished}
          />
          <span
            className={`toggle-switch block h-6 w-10 rounded-full p-1 transition-all duration-300 ease-in-out ${
              isPublished ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`toggle-knob block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                isPublished ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </span>
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitchPublish;
