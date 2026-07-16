import { useTranslation } from 'react-i18next';
import PWAInstallButton from './PWAInstallButton';
import LanguageSelector from './LanguageSelector';

const AppButtons = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <PWAInstallButton />
      <LanguageSelector />
    </div>
  );
};

export default AppButtons;