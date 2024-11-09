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
    const docRef = db.collection(String(collectionName)).doc(String(docId));
    const item = await docRef.get();
    if (!item.exists) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    // Convert Firestore document data to plain JSON
    const data = item.data();
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Failed to fetch document:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
