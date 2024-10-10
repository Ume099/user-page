import { db } from '@/lib/firebase/firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { collectionName, docId } = req.query;

  if (!collectionName || !docId) {
    res.status(400).json({ message: 'collectionName or docId is missing' });
    return;
  }

  try {
    // Firestoreのクエリを使用して、dateフィールドがdocIdで始まるものを取得
    const collectionRef = db.collection(String(collectionName));
    const querySnapshot = await collectionRef
      .where('date', '>=', String(docId)) // docId以上のものを取得
      .where('date', '<', String(docId) + '\uf8ff') // docIdで始まるもののみを取得
      .get();

    if (querySnapshot.empty) {
      res.status(404).json({ message: 'No matching documents found' });
      return;
    }

    // 取得したドキュメントを配列に格納して返す
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(results);
  } catch (error: any) {
    console.error('Failed to fetch documents:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
