import { useMemo } from 'react';
import { IconType } from 'react-icons';
import { ImSpinner7 } from 'react-icons/im';

/**
 * Props:
 *   variant : ボタンのスタイルのタイプ
 *   label   : ボタンのテキスト
 *   Icon    : React Icon のアイコン
 *   loading : ローディング状態
 */

type Variant = 'primary' | 'secondary' | 'error' | 'error-secondary' | 'gray' | 'text';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  label: string;
  Icon?: IconType;
  loading?: boolean;
};

const getButtonColor = (variant: Variant): string => {
  switch (variant) {
    case 'primary':
      return 'border-primary bg-primary text-white disabled:border-theme-medium disabled:bg-theme-medium';
    case 'secondary':
      return 'border-primary bg-white text-primary disabled:border-theme-medium disabled:text-theme-medium';
    case 'error':
      return 'border-error bg-error text-white disabled:border-theme-medium disabled:bg-theme-medium';
    case 'error-secondary':
      return 'border-error bg-white text-error disabled:border-theme-medium disabled:text-theme-medium';
    case 'gray':
      return 'border-gray-400 bg-gray-300 text-gray-800 disabled:border-theme-medium disabled:text-theme-medium';
    default:
      return 'border-transparent bg-transparent text-primary hover:border-theme-light hover:bg-theme-light disabled:border-transparent disabled:bg-transparent disabled:text-theme-medium';
  }
};

// ボタン本体
const ButtonOriginal = (props: ButtonProps): JSX.Element => {
  const { variant = 'text', label, Icon, loading, ...buttonHTMLAttributes } = props;

  // variant でボタンの色を分岐
  const btnColor = useMemo(() => getButtonColor(variant), [variant]);

  // Component
  return (
    <>
      <button
        {...buttonHTMLAttributes}
        className={`text-btn relative flex items-center justify-center gap-1 rounded-md border px-4 py-2 text-center transition-all duration-200 ease-linear hover:opacity-70 disabled:opacity-100 ${
          loading && 'opacity-70 [&>span]:!text-transparent'
        } ${btnColor}`}
      >
        {Icon && (
          <span>
            <Icon size={18} />
          </span>
        )}
        <span>{label}</span>

        {loading && <ButtonLoading />}
      </button>

      {loading && <LoadingLayer />}
    </>
  );
};

export default ButtonOriginal;

// ボタンのローディングアイコン
const ButtonLoading = () => {
  return (
    <div className="absolute text-center align-middle">
      <ImSpinner7 size="18px" className="animate-spin" />
    </div>
  );
};

// ローディング中に画面をクリックできないようにする
const LoadingLayer = () => {
  return <div className="fixed left-0 top-0 z-[999] h-screen w-screen bg-transparent" />;
};
