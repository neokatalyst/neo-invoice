import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { full_name, email, password, phone, company } = req.body;

    const user = await User.create({ full_name, email, password, phone, company });
    res.status(201).json({ message: 'User created', user });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
}
