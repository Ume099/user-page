import { IconType } from 'react-icons';
import { ImSpinner7 } from 'react-icons/im';

/**
 * Props:
 *   variant : ボタンのスタイルのタイプ
 *   label   : ボタンのテキスト
 *   Icon    : React Icon のアイコン [optional]
 *   loading : ローディング状態
 */

export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: 'primary' | 'secondary';
  Icon?: IconType;
  loading?: boolean;
};

// ボタン本体
const Submit = (props: Props): JSX.Element => {
  const { variant, Icon, loading, className = '' } = props;

  // variant でボタンの色を分岐
  const btnColor =
    variant === 'primary'
      ? 'border-primary bg-primary text-white disabled:border-theme-medium disabled:bg-theme-medium'
      : variant === 'secondary'
      ? 'border-primary bg-white text-primary disabled:border-theme-medium disabled:text-theme-medium'
      : '';

  // Component
  return (
    <>
      <input
        type="submit"
        className={`rounded-lg border bg-primary px-3 py-2 ${
          loading ? 'opacity-70 [&>span]:!text-transparent' : ''
        } ${btnColor} ${className}`}
        value="POST"
        disabled={!!loading}
      />
      {Icon && (
        <span>
          <Icon size={18} />
        </span>
      )}

      {loading && <ButtonLoading />}

      {loading && <LoadingLayer />}
    </>
  );
};

export default Submit;

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
