import OptionalChip from '@/components/common/parts/OptionalChip';
import RequiredChip from '@/components/common/parts/RequiredChip';
import { UseFormRegisterReturn } from 'react-hook-form';

type optionListObj = {
  name: string;
  value: string;
};

type Props = {
  label?: string;
  optionList: optionListObj[];
  isRequired?: boolean;
  selectedIndex?: number;
  className?: string;
  register?: UseFormRegisterReturn<any>;
};

const SelectObj = ({
  label,
  optionList,
  isRequired,
  selectedIndex,
  className,
  register,
}: Props): JSX.Element => {
  return (
    <div className={'mb-4 flex flex-col items-start gap-2'}>
      <label className="flex shrink-0 items-start justify-start md:justify-between">
        <span className="text-base">{label}</span>
        {isRequired !== undefined && isRequired && <RequiredChip />}
        {isRequired !== undefined && !isRequired && <OptionalChip />}
      </label>
      <div className="w-full">
        <div className="w-full">
          <select
            defaultValue={String(optionList[selectedIndex || 0])}
            {...register}
            className={`text-md w-full rounded border border-gray-300 px-1 py-1 ${className}`}
          >
            {optionList.map((option, index) => (
              <option key={String(option) + index} value={option.value || ''}>
                {option.name || ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SelectObj;
