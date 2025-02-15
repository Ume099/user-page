import { displayName } from '@/hooks/atom/models/types';

// UID からユーザーの表示名を取得する関数
export const getUserDisplayName = async (uid: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/userActions/getUserDisplayName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid }),
    });

    const data = await response.json();

    if (response.ok) {
      return data.displayName || null;
    } else {
      console.error('Error fetching display name:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
};

// UID のリストからユーザーの表示名を取得する関数
export const getUserDisplayNameObject = async (
  uidList: string[],
): Promise<{ uid: string; displayName: string }[]> => {
  return Promise.all(
    uidList.map(async (uid) => ({
      uid,
      displayName: (await getUserDisplayName(uid)) ?? '',
    })),
  );
};

export const getDisplayNameByUid = (users: displayName[], uid: string): string => {
  const user = users.find((user) => user.uid === uid);
  if (uid === 'unabailable') {
    return '';
  }
  return user ? user.displayName : '?';
};
