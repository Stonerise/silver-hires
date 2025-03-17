import mongoose from 'mongoose';
import multer from 'multer';
import { authenticateToken } from '../../../lib/authMiddleware';
import User from '../../../models/User';

const upload = multer({ dest: 'uploads/' });

export const config = {
    api: { bodyParser: false }
};

const connectToDatabase = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
};

export default authenticateToken(async (req, res) =>{
    await connectToDatabase();
    if (req.method !== 'POST') return res.status(405).json({ msg: 'Method not allowed' });

    upload.single('photo')(req, res, async (err) => {
        if (err) return res.status(500).json({ msg: 'Upload error' });
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

        const photoUrl = `/uploads/${req.file.filename}`;
        try {
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { photoUrl },
                { new: true }
            ).select('-password');
            res.json({ photoUrl: user.photoUrl });
        } catch (error) {
            res.status(500).json({ msg: 'Server error' });
        }
    });
});