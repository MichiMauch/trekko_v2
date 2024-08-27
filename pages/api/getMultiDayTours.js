import dbConnect from '../../lib/dbConnect';
import MultiDayTour from '../../models/MultiDayTour';

export default async function handler(req, res) {
  try {
    await dbConnect();
    console.log('Connected to database');

    const tours = await MultiDayTour.find({});
    res.status(200).json({ success: true, data: tours });
  } catch (error) {
    console.error('Error retrieving tours:', error);
    res.status(500).json({ success: false, message: 'Error retrieving tours.' });
  }
}
