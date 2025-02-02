import { db } from '@/lib/firebase/firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const collectionRef = db.collection('standardSeatMap');
    const querySnapshot = await collectionRef.get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No documents found in standardSeatMap' });
    }

    // ドキュメントを取得
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));

    return res.status(200).json(documents);
  } catch (error: any) {
    console.error('ドキュメントの取得に失敗しました:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
