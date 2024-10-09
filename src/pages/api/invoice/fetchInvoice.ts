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
    const collectionRef = db.collection(String(collectionName));

    // `docId` で始まるドキュメントを検索
    const querySnapshot = await collectionRef
      .where('__name__', '>=', String(docId))
      .where('__name__', '<', String(docId) + '\uf8ff') // `\uf8ff` は最大のunicode文字で、部分一致を実現
      .get();

    if (querySnapshot.empty) {
      res.status(404).json({ message: 'No matching documents found' });
      return;
    }

    // 取得したドキュメントを配列に変換
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));

    res.status(200).json(documents);
  } catch (error: any) {
    console.error('ドキュメントの取得に失敗しました:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
