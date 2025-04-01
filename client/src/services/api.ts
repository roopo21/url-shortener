// client/src/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface UrlData {
  _id: string;
  originalUrl: string;
  shortId: string;
  clicks: number;
  createdAt: string;
}

export interface CreateUrlRequest {
  originalUrl: string;
  customShortId?: string;
}

const api = {
    // Create a shortened URL
    createShortUrl: async (data: CreateUrlRequest): Promise<UrlData> => {
      const response = await axios.post(`${API_BASE_URL}/urls`, data);
      return response.data;
    },
    
    // Get all URLs
    getAllUrls: async (): Promise<UrlData[]> => {
      const response = await axios.get(`${API_BASE_URL}/urls`);
      return response.data;
    },
  
    // Get the original URL and redirect (issue in the current code)
    redirectToUrl: async (shortId: string): Promise<UrlData> => {
      const response = await axios.get(`${API_BASE_URL}/urls/${shortId}`);
      return response.data;
    },
  
    // Get the base URL for shortened links
    getBaseUrl: (): string => {
      return import.meta.env.VITE_SHORT_URL_BASE || 'http://localhost:5001/';
    }
  };
  

export default api;