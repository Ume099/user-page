import { ServiceAccount } from '@/lib/firebase/firebase-admin';
import admin from 'firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { year, month, studentId } = req.body as {
    year: number;
    month: number; // 1-12
    studentId: string; // 追加する ID
  };

  if (!year || !month || !studentId) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }

  const db = admin.firestore();
  const coll = db.collection(`openDay_${year}_${month}`); // openDay_2025_2
  const batch = db.batch();

  const lastDate = new Date(year, month, 0).getDate(); // その月の最終日
  const fetches: Promise<admin.firestore.DocumentSnapshot>[] = [];

  for (let d = 1; d <= lastDate; d++) {
    const date = new Date(year, month - 1, d);
    if (date.getDay() !== 0) continue; // 日曜だけ

    const docRef = coll.doc(`day_${d}`);
    fetches.push(docRef.get().then((snap) => ({ snap, docRef } as const)));
  }

  const results = await Promise.all(fetches);

  results.forEach(({ snap, docRef }) => {
    if (snap.exists) {
      batch.set(
        docRef,
        { class5: admin.firestore.FieldValue.arrayUnion(studentId) }, // 既存＋追加
        { merge: true },
      );
    }
  });

  if (batch._ops.length === 0) {
    return res.status(200).json({ message: 'No existing Sunday documents to update' });
  }

  try {
    await batch.commit();
    res.status(200).json({ message: 'Student added to existing Sunday class5 docs' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
