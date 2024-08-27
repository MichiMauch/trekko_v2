import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Route from '../../models/Route';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  try {
    const activities = await Route.find().sort({ date: -1 });
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error fetching activities', error });
  }
}
