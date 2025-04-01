// client/src/components/UrlForm.tsx
import { useState } from 'react';
import api, { UrlData } from '../services/api';

interface UrlFormProps {
  onUrlCreated: (newUrl: UrlData) => void;
}

const UrlForm = ({ onUrlCreated }: UrlFormProps) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customShortId, setCustomShortId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!originalUrl) {
      setError('Please enter a URL');
      return;
    }
    
    try {
      setIsLoading(true);
      const newUrl = await api.createShortUrl({
        originalUrl,
        ...(customShortId && { customShortId }),
      });
      
      setOriginalUrl('');
      setCustomShortId('');
      onUrlCreated(newUrl);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create short URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Shorten a URL</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL to Shorten
          </label>
          <input
            id="originalUrl"
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com/long-url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="customShortId" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Short URL (optional)
          </label>
          <input
            id="customShortId"
            type="text"
            value={customShortId}
            onChange={(e) => setCustomShortId(e.target.value)}
            placeholder="my-custom-url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {isLoading ? 'Creating...' : 'Shorten URL'}
        </button>
      </form>
    </div>
  );
};

export default UrlForm;