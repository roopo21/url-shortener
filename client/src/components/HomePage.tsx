// client/src/pages/HomePage.tsx
import { useEffect, useState } from 'react';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import api, { UrlData } from '../services/api';

const HomePage = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const data = await api.getAllUrls();
        setUrls(data);
      } catch (err) {
        setError('Failed to load URLs');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const handleUrlCreated = (newUrl: UrlData) => {
    setUrls([newUrl, ...urls]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Shortener</h1>
        <p className="text-gray-600">Create short, memorable links that redirect to your long URLs</p>
      </header>

      <UrlForm onUrlCreated={handleUrlCreated} />

      {isLoading ? (
        <div className="text-center mt-8">
          <p>Loading URLs...</p>
        </div>
      ) : error ? (
        <div className="text-center mt-8 text-red-600">
          <p>{error}</p>
        </div>
      ) : (
        <UrlList urls={urls} />
      )}
    </div>
  );
};

export default HomePage;