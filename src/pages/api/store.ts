import { ServiceAccount } from '@/lib/firebase/firebase-admin';
import admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 秘密鍵を取得
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const COLLECTION_NAME = 'users';

  // 初期化する
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: cert(ServiceAccount),
    });
  }

  const db = getFirestore();

  // req.bodyの型
  type InsertDataType = {
    startTime: Date;
    timeRange: number;
  };

  if (req.method === 'POST') {
    try {
      // eslint-disable-next-line
      const { timeRange } = req.body;
      if (!timeRange) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }
      const docRef = db.collection(COLLECTION_NAME).doc();
      const insertData: InsertDataType = {
        startTime: new Date(),
        // eslint-disable-next-line
        timeRange,
      };
      await docRef.set(insertData);
      res.status(200).json({ message: 'Document successfully written!' });
    } catch (error) {
      res.status(500).json({ error: 'Error writing document' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
