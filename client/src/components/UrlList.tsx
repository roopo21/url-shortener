// client/src/components/UrlList.tsx
import { useState } from 'react';
import api, { UrlData } from '../services/api';

interface UrlListProps {
  urls: UrlData[];
}

const UrlList = ({ urls }: UrlListProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const baseUrl = api.getBaseUrl();
  
  const copyToClipboard = async (shortId: string) => {
    const fullUrl = `${baseUrl}${shortId}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(shortId);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  if (urls.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-8">
        No URLs yet. Shorten your first URL above!
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Shortened URLs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Original URL</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Short URL</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Clicks</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Created</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {urls.map((url) => {
              const shortUrl = `${baseUrl}${url.shortId}`;
              const displayUrl = url.originalUrl.length > 50 
                ? `${url.originalUrl.substring(0, 47)}...` 
                : url.originalUrl;
              
              return (
                <tr key={url._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">
                    <a 
                      href={url.originalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {displayUrl}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    <a 
                      href={shortUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {shortUrl}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{url.clicks}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => copyToClipboard(url.shortId)}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      {copiedId === url.shortId ? 'Copied!' : 'Copy'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UrlList;