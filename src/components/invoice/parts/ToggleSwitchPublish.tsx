import { useToast } from '@chakra-ui/react';
import { FormatInvoice } from '@/lib/invoice';
import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type ToggleProps = {
  label?: string;
  className?: string;
  register?: UseFormRegisterReturn<any>;
  id: string;
  isDefaultPublished: boolean;
  invoice: FormatInvoice;
};

const ToggleSwitchPublish = (props: ToggleProps): JSX.Element => {
  const { label, className, register, id, isDefaultPublished, invoice } = props;
  const [isPublished, setIsPublished] = useState(isDefaultPublished);

  const toast = useToast();

  const handleToggleIsPublished = async () => {
    if (!isPublished && !confirm('メールが送信されます。')) {
      return; // 何もしない
    }

    await upDateIsPublished(!isPublished);
    if (!isPublished) {
      if (invoice.mail) {
        await sendMail();
      } else {
        toast({
          title: 'メールが登録されていません。',
          status: 'error',
          position: 'top-right',
        });
      }
    }
    setIsPublished((prev) => !prev);
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

  const sendMail = async () => {
    const res = await fetch('/api/invoice/sendMail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: invoice.fullName,
        sendTo: invoice.mail,
        year: invoice.date.split('_')[0],
        month: invoice.date.split('_')[1],
      }),
    });

    const data = await res.json();

    console.log(res.status);
    if (data) {
      toast({
        title: res.status === 200 ? '発行メールを送信しました。' : 'メールの送信に失敗しました。',
        status: res.status === 200 ? 'success' : 'warning',
        position: 'top-right',
      });
    }
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
