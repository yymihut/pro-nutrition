import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pronutritionaiteam.NovaNutriCalc',
  appName: 'NovaNutriCalc',
  webDir: 'build',
  android: {
    path: 'android',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 3000,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: false,
      splashImmersive: false,
    },
    // alte plugin-uri...
  },
};


export default config;
