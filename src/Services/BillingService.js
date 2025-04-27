// Services/BillingService.js – compatibil cu „cordova-plugin-purchase” v13+
// -------------------------------------------------------------------------
// Foloseşte noul spaţiu de nume global `CdvPurchase` (Google Play Billing v6).
// Pentru ESLint adăugăm directiva `/* global CdvPurchase */` ca să evităm eroarea
// „no‑undef”. Dacă preferi, poţi declara `declare var CdvPurchase: any;` într‑un
// fişier .d.ts, însă soluţia de mai jos e suficientă pentru proiectele JS.

/* global CdvPurchase */

import { Preferences } from '@capacitor/preferences';
import { Capacitor }    from '@capacitor/core';

// ────────────────────────────────────────────────────────────────────────────
// CONFIGURARE
// ────────────────────────────────────────────────────────────────────────────
const PRODUCT_ID = 'remove_ads_sku';        // SKU din Google Play Console
const ADS_KEY    = 'adsRemoved';            // cheie salvată cu Capacitor Preferences

// ────────────────────────────────────────────────────────────────────────────
// HELPER: verifică dacă user‑ul a cumpărat deja pachetul „remove ads”
// ────────────────────────────────────────────────────────────────────────────
export const hasRemoveAds = async () =>
  (await Preferences.get({ key: ADS_KEY })).value === 'true';

// ────────────────────────────────────────────────────────────────────────────
// INITIALIZARE BILLING
// ────────────────────────────────────────────────────────────────────────────
export const initBilling = (onSuccess) => {
  // 1️⃣ Rulează doar pe dispozitiv mobil (Capacitor native)
  if (!Capacitor.isNativePlatform()) return;

  // 2️⃣ Aşteptăm evenimentul „deviceready” ca să fim siguri că plugin‑urile
  //    Cordova au injectat obiectele lor în `window`.
  const onDeviceReady = () => {
    const waitForCdvPurchase = () => {
      if (!window.CdvPurchase) {
        console.warn('[Billing] CdvPurchase încă nu e disponibil … retry 400 ms');
        setTimeout(waitForCdvPurchase, 400);
        return;
      }

      // 3️⃣ Obţinem store‑ul şi platforma Google Play
      const store = window.CdvPurchase.store;
      const gp    = window.CdvPurchase.Platform.GOOGLE_PLAY;

      // 4️⃣ Înregistrăm produsul
      store.register([
        {
          id:       PRODUCT_ID,
          type:     window.CdvPurchase.ProductType.NON_CONSUMABLE,
          platform: gp,
        },
      ]);

      // 5️⃣ Gestionăm achiziţiile aprobate
      store.when().approved(async (purchase) => {
        if (purchase.id === PRODUCT_ID) {
          await Preferences.set({ key: ADS_KEY, value: 'true' });
          await purchase.finish();      // finalizează tranzacţia
          onSuccess?.();                // notifică aplicaţia (ex: ascunde reclame)
        }
      });

      // 6️⃣ Pornim subsistemul IAP – trebuie apelat o singură dată
      store.initialize([gp]).catch((e) =>
        console.error('[Billing] store.initialize failed', e)
      );
    };

    waitForCdvPurchase();
  };

  document.addEventListener('deviceready', onDeviceReady, { once: true });
};

// ────────────────────────────────────────────────────────────────────────────
// COMANDĂ DE CUMPĂRARE
// ────────────────────────────────────────────────────────────────────────────
export const buyRemoveAds = () => {
  window.CdvPurchase?.store?.order(PRODUCT_ID);
};
