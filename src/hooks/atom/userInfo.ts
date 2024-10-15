import { atom } from 'recoil';

// userInfo 表示用 State
export type UserInfo = {
  uid: string;
  isSignedIn: boolean;
  userName: string | null;
  email?: string | null;
  isFirstTime: boolean;
};

export const userInfoState = atom<UserInfo>({
  key: 'userInfoState',
  default: {
    uid: '',
    isSignedIn: false,
    userName: '',
    email: '',
    isFirstTime: false,
  },
});
