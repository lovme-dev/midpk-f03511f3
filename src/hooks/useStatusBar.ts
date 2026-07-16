import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useTheme } from 'next-themes';

export const useStatusBar = () => {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const setStatusBarStyle = async () => {
      try {
        const currentTheme = theme === 'system' ? systemTheme : theme;
        
        if (currentTheme === 'dark') {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: 'transparent' });
        } else {
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setBackgroundColor({ color: 'transparent' });
        }
        
        await StatusBar.setOverlaysWebView({ overlay: true });
      } catch (error) {
        // StatusBar plugin not available (web browser)
        console.log('StatusBar plugin not available');
      }
    };

    setStatusBarStyle();
  }, [theme, systemTheme]);
};