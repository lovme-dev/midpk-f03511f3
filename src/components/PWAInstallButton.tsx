import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import usePWAInstall from '@/hooks/usePWAInstall';

const PWAInstallButton = () => {
  const { t } = useTranslation();
  const { isInstallable, isBrowser, handleInstall } = usePWAInstall();

  // Only show in browser mode (not in installed PWA) and when installable
  if (!isInstallable || !isBrowser) return null;

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 min-w-[140px] bg-gray-900/80 border-gray-700/60 text-white hover:bg-gray-800/90 hover:border-gray-600/80 transition-all duration-300 hover:scale-105 shadow-lg"
    >
      <Download className="w-4 h-4" />
      <span className="font-medium">{t('installApp')}</span>
    </Button>
  );
};

export default PWAInstallButton;