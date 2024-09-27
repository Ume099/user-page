import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase/firebase-admin';

type TimeSlot = `${string}_${string}_${string}-${string}`;

interface reqBody {
  collectionName: string;
  date: number;
  dayOfWeek: string;
  [key: TimeSlot]: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { collectionName, date, dayOfWeek, ...remainingSeats }: reqBody = req.body;

  const checkIsReqBodyFull = () => {
    return collectionName && date && dayOfWeek && Object.keys(remainingSeats).length > 0;
  };

  if (!checkIsReqBodyFull()) {
    res.status(400).json({ message: 'Bad Request: Missing required fields' });
    return;
  }

  try {
    const collectionRef = db.collection(collectionName);
    const docId = `day_${date}`;
    const docRef = collectionRef.doc(docId);

    await docRef.set({
      date,
      dayOfWeek,
      ...remainingSeats,
    });
    res.status(201).json({ message: 'Document created successfully', docId: docRef.id });
  } catch (error: any) {
    console.error('Error adding open day:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
