import { ServiceAccount } from '@/lib/firebase/firebase-admin';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

// 初期化部分を修正
if (!getApps().length) {
  initializeApp({
    credential: cert(ServiceAccount),
  });
}

const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const COLLECTION_NAME = 'users';

  if (req.method === 'POST') {
    try {
      const docRef = db.collection(COLLECTION_NAME).doc('uid');
      const insertData = {
        test: 'test',
      };
      await docRef.set(insertData);
      return res.status(200).json({ message: 'Document successfully written!' });
    } catch (error) {
      console.error('Error writing document: ', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
