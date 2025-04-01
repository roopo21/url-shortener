import { Request, Response} from 'express';
import { UrlModel } from '../models/url.model';
import validUrl from 'valid-url';
import {nanoid} from 'nanoid-cjs';

export const createShortUrl = async (req: Request, res: Response): Promise<void> => {
    try {
        const { originalUrl, customShortId } = req.body;

        if(!validUrl.isWebUri(originalUrl)){
             res.status(400).json({ error: 'Invalid URL'});
             return;
        }

        const existingUrl = await UrlModel.findOne({originalUrl});
        if(existingUrl) {
             res.json({existingUrl});
             return;
        }

        if (customShortId) {
            const existingCustomUrl = await UrlModel.findOne({ shortId: customShortId });
            if (existingCustomUrl) {
               res.status(400).json({ error: 'Custom short ID already in use' });
               return;
            }
          }
        
          let shortId = customShortId;
          if (!shortId) {
            do {
              shortId = nanoid(8);
              const existingShortId = await UrlModel.findOne({ shortId });
              if (!existingShortId) break;
            } while (true);
          }

        const urlDoc = new UrlModel({
            originalUrl,
            shortId
        });

        await urlDoc.save();
        res.status(201).json(urlDoc);
    }
    catch(error){
        console.error('Error creating short URL:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

export const redirectToUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shortId } = req.params;
      
      const url = await UrlModel.findOne({ shortId });
      
      if (!url) {
         res.status(404).json({ error: 'URL not found' });
         return;
      }
      
      // Increment the click counter
      url.clicks++;
      await url.save();
      
      // Redirect to the original URL
      res.redirect(url.originalUrl);
    } catch (error) {
      console.error('Error redirecting:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  export const getAllUrls = async (req: Request, res: Response) => {
    try {
      const urls = await UrlModel.find().sort({ createdAt: -1 });
      res.json(urls);
    } catch (error) {
      console.error('Error getting URLs:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };