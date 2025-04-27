// Services/BillingService.js
import { Preferences } from '@capacitor/preferences';
import { Capacitor }  from '@capacitor/core';
import 'cordova-plugin-purchase/www/store.js';

const PRODUCT_ID = 'remove_ads_sku';
const ADS_KEY    = 'adsRemoved';

export const hasRemoveAds = async () => {
  const { value } = await Preferences.get({ key: ADS_KEY });
  return value === 'true';
};

export const initBilling = (onSuccess) => {
  if (!Capacitor.isNativePlatform()) {
    console.warn('Not a native platform.');
    return;
  }

  const waitForStore = () => {
    if (!window.store) {
      console.warn('Store not ready yet... retrying in 500ms');
      setTimeout(waitForStore, 500);
      return;
    }

    // -- Script de testare store --
    const testStore = () => {
      if (!window.store) {
        console.error('Store not available at all.');
        return;
      }
      console.log('Testing store structure...');
      console.log('Available methods:');
      ['register', 'order', 'when', 'refresh', 'error'].forEach(method => {
        console.log(`${method}:`, typeof window.store[method]);
      });
    };

    testStore(); // ← aici apelăm verificarea!

    const store = window.store;
    store.verbosity = store.DEBUG;

    store.register({
      id: PRODUCT_ID,
      type: store.NON_CONSUMABLE,
    });

    store.when(PRODUCT_ID).owned(async () => {
      await Preferences.set({ key: ADS_KEY, value: 'true' });
      onSuccess?.();
    });

    store.when(PRODUCT_ID).approved(async (p) => {
      await Preferences.set({ key: ADS_KEY, value: 'true' });
      p.finish();
      onSuccess?.();
    });

    store.error((e) => console.warn('[IAP Error]', e));
    store.refresh();
  };

  waitForStore();
};




export const buyRemoveAds = () => {
  window.store?.order(PRODUCT_ID);
};
