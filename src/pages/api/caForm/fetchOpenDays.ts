import { db } from '@/lib/firebase/firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { collectionName } = req.query;

  if (!collectionName || typeof collectionName !== 'string') {
    res.status(400).json({ message: 'collectionName is missing or invalid' });
    return;
  }

  try {
    const snapshot = await db.collection(collectionName).get();
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(items);
  } catch (error: unknown) {
    console.error('Failed to fetch data from Firestore:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
