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
const PRODUCT_ID = 'remove_ads_sku';        // 'remove_ads_sku' -pt productie SKU definit în Google Play Console
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
export const initBilling = (onChange) => {
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

          // Tranzacţia aprobată (cumpărare nouă)
store.when(PRODUCT_ID).approved(async (p) => {
  await Preferences.set({ key: ADS_KEY, value: 'true' });
  await p.finish();
  onChange?.(true);
});

// Refund / revocare
const revokedOrCancelled =
  store.when(PRODUCT_ID).revoked   // v14+
  ?? store.when(PRODUCT_ID).cancelled; // ≤ v13

revokedOrCancelled?.(async () => {
  await Preferences.set({ key: ADS_KEY, value: 'false' });
  onChange?.(false);
});

// Siguranţă: sincronizare la fiecare refresh/launch
store.when(PRODUCT_ID).updated(async (prod) => {
    /* ignoră prima sincronizare (care vine imediat după initialize)
       dacă a existat deja un eveniment revoked()/cancelled() în aceeaşi sesiune */
    const current = (await Preferences.get({ key: ADS_KEY })).value === 'true';
    const next    = !!prod.owned;
    if (current === next) return;        // nu mai suprascrie cu aceiaşi valoare
  
  await Preferences.set({ key: ADS_KEY, value: next ? 'true' : 'false' });
   onChange?.(next);
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
export const buyRemoveAds = async (onOwnedChange) => {
  if (!Capacitor.isNativePlatform()) {
    alert('In-app purchases sunt disponibile doar pe dispozitiv.');
    return;
  }

  try {
    if (_initPromise) await _initPromise;
    if (_readyPromise) await _readyPromise;
  } catch (e) {
    console.error('[Billing] init / ready error', e);
    return;
  }

  const store = window.CdvPurchase?.store;
  if (!store) {
    console.log('[Billing] if if (!store) { – :', !store);
    console.warn('[Billing] Store nu este disponibil – abort order.');
    return;
  }

  /* 🔄 sincronează inventarul cu serverul Play înainte de orice test */
  try { await store.update(); } catch (e) {
    console.log('[Billing] try { await store.update(); } – :', store); 
    console.warn('[Billing] refresh', e); 
  }

  const product = store.get(PRODUCT_ID);
   if (!product) {                       // fallback de siguranţă
    console.log('[Billing] if (!product) { – :', !product);
       alert('Produsul nu este disponibil momentan. Încearcă mai târziu.');
       return;
     }
   /*–––––––––––––––––––––––––––––––––––––––––––––––––––––––––
     Dacă utilizatorul îl deţine deja → ascundem butonul imediat
    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾ */
   if (!product || !product.canPurchase) { 
    console.log('[Billing] if (!product || !product.canPurchase) {  – :', product, !product.canPurchase);              //  ↔  already owned
     alert('Deţii deja acest articol.');
     await Preferences.set({ key: ADS_KEY, value: 'true' });
     console.log("[Billing] await Preferences.set({ key: ADS_KEY, value: 'true' });  – :", ADS_KEY ); 
     onOwnedChange?.(true);                  // trimite update în UI
    return;
  }

  const offer = product.getOffer();
  try {
    await store.order(offer ?? product);
    console.log("[Billing] await store.order(offer ?? product);  – :", offer, product );
  } catch (e) {
    console.error('[Billing] order() a eşuat', e);
  }
};
