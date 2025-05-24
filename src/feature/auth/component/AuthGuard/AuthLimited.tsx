import { Box } from '@chakra-ui/react';
import { useAuthContext } from '@/feature/auth/provider/AuthProvider';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const ALLOWED_UID = ['tfsw7nz9ovb4', 'KZlzeAudgBVPawzaQuT7zo4BLCH3', 'wldd9hw7f1ye', 'coach0000'];

export const AuthLimited = ({ children }: Props) => {
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

  if (user && !ALLOWED_UID.includes(user?.uid)) {
    <Box>許可されていないアカウントです</Box>;
  }

  return <>{children}</>;
};
