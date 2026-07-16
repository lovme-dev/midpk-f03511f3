import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a9302f0d6ea6460ea23fd2a7b79740d3',
  appName: 'midasbuypubgmobile-59',
  webDir: 'dist',
  server: {
    url: 'https://a9302f0d-6ea6-460e-a23f-d2a7b79740d3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0c1730'
    }
  }
};

export default config;