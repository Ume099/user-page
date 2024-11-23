import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type ToggleProps = {
  label?: string;
  className?: string;
  register?: UseFormRegisterReturn<any>;
  id: string;
  isDefaultChecked: boolean;
};

const ToggleSwitchCheck = (props: ToggleProps): JSX.Element => {
  const { label, className, register, id, isDefaultChecked } = props;
  const [isChecked, setIsChecked] = useState(isDefaultChecked);

  const handleToggle = () => {
    upDateIsChecked(!isChecked);
    setIsChecked((prev) => !prev);
  };
  const toast = useToast();

  const upDateIsChecked = async (isChecked: boolean) => {
    const res = await fetch('/api/invoice/updateIsChecked', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, isChecked }),
    });

    const data = await res.json();
    if (data) {
      toast({
        title: !isChecked ? 'チェックを反映しました。' : 'チェックを外しました。',
        status: isChecked ? 'warning' : 'success',
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

export default ToggleSwitchCheck;
