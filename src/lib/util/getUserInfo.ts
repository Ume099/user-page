import admin from 'firebase-admin';

export const getEmailByUid = async (uid: string) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord.email; // メールアドレスを返す
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Unable to fetch email for this UID');
  }
};
