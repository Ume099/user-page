// uidからユーザーの表示名を取得する関数
export const getUserDisplayName = async (uid: String): Promise<string | null> => {
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
