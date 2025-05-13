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
    year: number; // 例: 2025
    month: number; // 1-12
    studentId: string; // 例: "mein0020"
  };

  if (!year || !month || !studentId) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }

  const db = admin.firestore();
  const coll = db.collection(`openDay_${year}_${month}`);
  const batch = db.batch();

  /** 取得結果の型 */
  type SnapItem = {
    snap: admin.firestore.DocumentSnapshot;
    ref: admin.firestore.DocumentReference;
  };

  const lastDate = new Date(year, month, 0).getDate(); // その月の最終日
  const fetches: Promise<SnapItem>[] = [];

  for (let d = 1; d <= lastDate; d++) {
    const date = new Date(year, month - 1, d);
    if (date.getDay() !== 0) continue; // 日曜のみ

    const ref = coll.doc(`day_${d}`);
    fetches.push(ref.get().then((snap) => ({ snap, ref } as SnapItem)));
  }

  const results = await Promise.all(fetches);

  let updateCount = 0;
  results.forEach(({ snap, ref }) => {
    if (snap.exists) {
      batch.set(ref, { class5: admin.firestore.FieldValue.arrayUnion(studentId) }, { merge: true });
      updateCount++;
    }
  });

  if (updateCount === 0) {
    return res.status(200).json({ message: 'No existing Sunday documents to update' });
  }

  try {
    await batch.commit();
    res.status(200).json({ message: `Student added to ${updateCount} Sunday doc(s)` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
