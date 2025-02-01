import { Box } from '@chakra-ui/react';
import { useAuthContext } from '@/feature/auth/provider/AuthProvider';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: Props) => {
  const { user } = useAuthContext();
  const { push } = useRouter();
  const router = useRouter();
  const currentPath = router.asPath; // 例: /articles?page=2 など

  if (typeof user === 'undefined') {
    return <Box>読み込み中...</Box>;
  }

  if (user === null) {
    push({
      pathname: '/signin',
      query: { redirectTo: currentPath },
    });
    return null;
  }

  return <>{children}</>;
};
