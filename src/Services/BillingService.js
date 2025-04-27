// Services/BillingService.js – compatibil cu „cordova-plugin-purchase” v13+
// -------------------------------------------------------------------------
// Foloseşte noul spaţiu de nume global `CdvPurchase` (Google Play Billing v6).
// Dacă vrei tip‑safety poţi adăuga în TS: `declare const CdvPurchase: any;`
/* global CdvPurchase */

import { Preferences } from '@capacitor/preferences';
import { Capacitor }    from '@capacitor/core';

// ────────────────────────────────────────────────────────────────────────────
// CONFIGURARE
// ────────────────────────────────────────────────────────────────────────────
const PRODUCT_ID = 'remove_ads_sku';        // SKU definit în Google Play Console
const ADS_KEY    = 'adsRemoved';            // cheie salvată cu Capacitor Preferences

// promisiuni interne – se vor rezolva după initialize şi după ce magazinul
// devine "ready" (toate produsele au fost descărcate şi validate)
let _initPromise  = null;
let _readyPromise = null;

// ────────────────────────────────────────────────────────────────────────────
// HELPER: verifică dacă user‑ul a cumpărat deja pachetul „remove ads”
// ────────────────────────────────────────────────────────────────────────────
export const hasRemoveAds = async () =>
  (await Preferences.get({ key: ADS_KEY })).value === 'true';

// ────────────────────────────────────────────────────────────────────────────
// INITIALIZARE BILLING
// ────────────────────────────────────────────────────────────────────────────
export const initBilling = (onSuccess) => {
  if (!Capacitor.isNativePlatform()) return;

  document.addEventListener(
    'deviceready',
    () => {
      const waitForCdvPurchase = () => {
        if (!window.CdvPurchase) {
          console.warn('[Billing] CdvPurchase încă nu e disponibil … retry in 400 ms');
          setTimeout(waitForCdvPurchase, 400);
          return;
        }

        const { store, Platform, ProductType } = window.CdvPurchase;
        const gp = Platform.GOOGLE_PLAY;

        // evităm să re‑înregistrăm dacă init a fost deja făcut
        if (!_initPromise) {
          // Înregistrăm produsul (NON_CONSUMABLE => se cumpără o singură dată)
          store.register([
            {
              id:       PRODUCT_ID,
              type:     ProductType.NON_CONSUMABLE,
              platform: gp,
            },
          ]);

          // Tratează achiziţia odată ce este aprobată de Google Play
          store.when(PRODUCT_ID).approved(async (purchase) => {
            await Preferences.set({ key: ADS_KEY, value: 'true' });
            await purchase.finish();
            onSuccess?.();
          });

          // Porneşte iniţializarea platformelor (fetch produse, etc.)
          _initPromise = store.initialize([gp]);
          _initPromise.catch((e) => console.error('[Billing] initialize failed', e));

          // Creează promisiune ce se rezolvă la `store.ready()`
          _readyPromise = new Promise((resolve) => {
            store.ready(() => {
              console.log('[Billing] Store READY – produse încărcate');
              resolve();
            });
          });
        }
      };

      waitForCdvPurchase();
    },
    { once: true }
  );
};

// ────────────────────────────────────────────────────────────────────────────
// COMANDĂ DE CUMPĂRARE
// ────────────────────────────────────────────────────────────────────────────
export const buyRemoveAds = async () => {
  if (!Capacitor.isNativePlatform()) {
    alert('In‑app purchases sunt disponibile doar pe dispozitiv.');
    return;
  }

  // aşteptăm init & ready
  try {
    if (_initPromise) await _initPromise;
    if (_readyPromise) await _readyPromise;
  } catch (e) {
    console.error('[Billing] init / ready error', e);
    return;
  }

  const store = window.CdvPurchase?.store;
  if (!store) {
    console.warn('[Billing] Store nu este disponibil – abort order.');
    return;
  }

  // obţinem produsul
  const product = store.get(PRODUCT_ID);
  if (!product) {
    console.warn('[Billing] Produsul nu a fost găsit în catalog – execut store.refresh() şi re‑încearcă.');
    try {
      await store.refresh();
    } catch (e) {
      console.error('[Billing] refresh failed', e);
    }
    return;
  }

  if (!product.canPurchase) {
    alert('Produsul nu poate fi achiziţionat (deja deţinut sau indisponibil).');
    return;
  }

  const offer = product.getOffer(); // NON_CONSUMABLE are un singur offer implicit
  try {
    await store.order(offer ?? product); // preferăm offer când există
  } catch (e) {
    console.error('[Billing] order() a eşuat', e);
  }
};
