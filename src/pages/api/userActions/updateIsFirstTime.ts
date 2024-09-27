import { db } from '@/lib/firebase/firebase'; // Firebaseのインスタンスをインポート
import { doc, updateDoc } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid } = req.body;
  if (req.method === 'POST') {
    try {
      // 更新するドキュメントの参照を取得
      const studentDocRef = doc(db, 'students', uid);

      // フィールドの更新
      await updateDoc(studentDocRef, {
        isFirstTime: false,
      });

      // 成功時のレスポンス
      res.status(200).json({ message: 'isFirstTime field updated to false successfully.' });
    } catch (error) {
      console.error('Error updating document: ', error);
      res.status(500).json({ error: 'Failed to update document.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
