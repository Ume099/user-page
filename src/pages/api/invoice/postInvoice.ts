import { getFirestore } from 'firebase-admin/firestore';
import type { NextApiRequest, NextApiResponse } from 'next';

const COLLECTION_NAME = 'invoice';

const db = getFirestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const {
    uid,
    date,
    dueDate,
    fullName,
    isChecked,
    isPublished,
    items,
    isPayed,
    totalPrice,
    payment,
  } = req.body;

  if (
    uid === undefined ||
    date === undefined ||
    dueDate === undefined ||
    fullName === undefined ||
    isChecked === undefined ||
    isPublished === undefined ||
    items === undefined ||
    isPayed === undefined ||
    totalPrice === undefined ||
    payment === undefined
  ) {
    res.status(400).json({ message: 'UID is required' });
    return;
  }

  try {
    const docRef = db.collection(COLLECTION_NAME).doc(`${uid}_${date}`);
    const insertData = {
      uid,
      date,
      dueDate,
      fullName,
      isChecked,
      isPublished,
      items,
      isPayed,
      totalPrice,
      payment,
    };
    await docRef.set(insertData);
    res.status(200).json({ message: 'Document successfully written!', data: insertData });
  } catch (error) {
    console.error('Error writing document: ', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
