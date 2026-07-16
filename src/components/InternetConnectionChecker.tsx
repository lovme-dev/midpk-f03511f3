import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from './ui/alert';
import { WifiOff, Wifi } from 'lucide-react';

const InternetConnectionChecker = () => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial connection status
    if (!navigator.onLine) {
      setShowOfflineMessage(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOfflineMessage) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] p-4">
      <Alert className="bg-red-500/90 border-red-600 text-white backdrop-blur-sm">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="font-medium">
          Your internet is not working. Please check your connection.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default InternetConnectionChecker;