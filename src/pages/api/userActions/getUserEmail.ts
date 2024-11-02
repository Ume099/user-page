// pages/api/getUserEmail.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase/firebase-admin';

type Data = {
  email?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { uid } = req.body;

  if (!uid) {
    res.status(400).json({ error: 'UID is required' });
    return;
  }

  try {
    const userRecord = await auth.getUser(uid);
    res.status(200).json({ email: userRecord.email || '' });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user email' });
  }
}
