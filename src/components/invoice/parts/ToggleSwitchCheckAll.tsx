import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { toast } from 'react-toastify';

type ToggleProps = {
  label?: string;
  className?: string;
  register?: UseFormRegisterReturn<any>;
  isDefaultChecked: boolean;
  uidList: string[];
};

const ToggleSwitchCheckAll = (props: ToggleProps): JSX.Element => {
  const { label, className, register, isDefaultChecked = false, uidList } = props;
  const [isChecked, setIsChecked] = useState(isDefaultChecked);

  const handleToggle = async () => {
    setIsChecked((prev) => !prev);
    uidList?.forEach(async (uid) => await upDateIsChecked(!isChecked, uid));
  };

  const upDateIsChecked = async (isChecked: boolean, uid: string) => {
    try {
      const res = await fetch('/api/invoice/updateIsChecked', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: uid, isChecked }),
      });

      const data = await res.json();
      console.log(data);
      if (data) {
        toast.success('チェックを反映しました。');
      }
    } catch (error) {
      toast.error(`エラーが発生しました。${error}`);
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
            checked={isChecked}
            onChange={handleToggle}
          />
          <span
            className={`toggle-switch block h-6 w-10 rounded-full p-1 transition-all duration-300 ease-in-out ${
              isChecked ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`toggle-knob block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                isChecked ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </span>
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitchCheckAll;
