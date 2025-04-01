import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import urlRoutes from './routes/url.routes'
import { IUrl, UrlModel } from './models/url.model';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortner';

// middleware



app.use(cors()); // Allow all origins  
app.use(express.json());



app.use('/api/urls', urlRoutes);

app.get('/:shortId', async (req, res) => {
    try {
      const { shortId } = req.params;
      const url = await UrlModel.findOneAndUpdate(
        { shortId }, // Query to find the document
        { $inc: { clicks: 1 } }, // Increment the clicks field by 1
        { new: true } // Return the updated document after the increment
      );
      if (!url) {
         res.status(404).json({ error: 'URL not found' });
         return;
      }
      else{
        res.redirect(301, url.originalUrl)
      }
    } catch (error) {
      console.error('Error in redirect:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });