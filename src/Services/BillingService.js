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
  if (!Capacitor.isNativePlatform() || !window.store) return;

  const store = window.store;
  store.verbosity = store.DEBUG;          // vezi tot în logcat (optional)

  store.register({ id: PRODUCT_ID, type: store.NON_CONSUMABLE });

  // deja cumpărat
  store.when(PRODUCT_ID).owned(async () => {
    await Preferences.set({ key: ADS_KEY, value: 'true' });
    onSuccess?.();
  });

  // cumpărat acum
  store.when(PRODUCT_ID).approved(async (p) => {
    await Preferences.set({ key: ADS_KEY, value: 'true' });
    p.finish();
    onSuccess?.();
  });

  store.error((e) => console.warn('[IAP] ', e));
  store.refresh();
};

export const buyRemoveAds = () => {
  window.store?.order(PRODUCT_ID);
};
