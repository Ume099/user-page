import { db } from '@/lib/firebase/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ message: 'UID is required' });
  }

  try {
    // `standardSeatMap` コレクションのすべてのドキュメントを取得
    const documents = await db.collection('standardSeatMap').listDocuments();

    for (const docRef of documents) {
      const doc = await docRef.get();
      if (!doc.exists) continue;

      const data = doc.data();
      const fieldsToUpdate: Record<string, FieldValue> = {};

      // `class1` から `class7` までのフィールドに対して UID の削除を試みる
      for (let i = 1; i <= 7; i++) {
        const classField = `class${i}`;
        if (data && data[classField]?.includes(uid)) {
          fieldsToUpdate[classField] = FieldValue.arrayRemove(uid);
        } else {
          throw Error;
        }
      }

      // 更新が必要なフィールドがある場合のみドキュメントを更新
      if (Object.keys(fieldsToUpdate).length > 0) {
        await docRef.update(fieldsToUpdate);
      }
    }

    res.status(200).json({ message: `UID ${uid} removed from all classes in standardSeatMap.` });
  } catch (error) {
    console.error('Error removing UID from classes:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
