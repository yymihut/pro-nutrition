import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pronutritionaiteam.NovaNutriCalc',
  appName: 'NovaNutriCalc',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 3000,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: false,
      splashImmersive: false,
    },
    AdMob: {},
    InAppPurchases: {}
  },
};


export default config;
