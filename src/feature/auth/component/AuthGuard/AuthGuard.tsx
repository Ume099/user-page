import { useAuthContext } from '@/feature/auth/provider/AuthProvider';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

type Props = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: Props) => {
  const { user } = useAuthContext();
  const { push } = useRouter();

  useEffect(() => {
    if (typeof user === 'undefined') {
      // Do nothing while loading
    } else if (user === null) {
      push('/signin');
    }
  }, [user, push]);

  if (typeof user === 'undefined') {
    return <div>読み込み中...</div>;
  }

  return <>{children}</>;
};
