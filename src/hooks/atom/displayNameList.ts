import { atom, selector } from 'recoil';
import { displayName } from './models/types';

// 空の状態
export const displaNameState = atom<displayName[]>({
  key: 'displaNameState',
  default: [],
});
