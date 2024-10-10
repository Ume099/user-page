// pages/api/invoice/check.ts
import { db } from '@/lib/firebase/firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, isChecked } = req.body;

    if (isChecked === null || isChecked === undefined) {
      return res.status(400).json({ error: 'Invoice ID is required' });
    }

    if (!id) {
      return res.status(400).json({ error: 'Invoice ID is required' });
    }

    try {
      // 指定されたIDのドキュメントを取得
      const invoiceRef = db.collection('invoice').doc(id);

      // isCheckedをtrueに更新
      await invoiceRef.update({
        isChecked,
      });

      return res.status(200).json({ message: 'Invoice isChecked updated successfully' });
    } catch (error) {
      console.error('Error updating document:', error);
      return res.status(500).json({ error: 'Failed to update invoice' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
