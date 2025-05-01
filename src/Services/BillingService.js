// BillingService.js – v4.1  (single listener, debounce false)

/* ─ CONFIG ─ */
import { Capacitor }          from '@capacitor/core';
import { Preferences }        from '@capacitor/preferences';
import {
  Purchases,
  PRODUCT_CATEGORY,
  PURCHASES_ERROR_CODE,
}                             from '@revenuecat/purchases-capacitor';

const RC_PUBLIC_API_KEY = 'goog_ICPUybykxyEWprixoBdQrEXeQkl';
const RC_SECRET_API_KEY = 'sk_XwhSCZGjMwAurmQlZrNcZFEXvFmlg';   // QA only
const RC_PROJECT_ID     = 'projd457dd74';

const ENTITLEMENT_ID    = 'remove_ads';
const STORE_PRODUCT_ID  = 'remove_ads_sku2';

const PREF_ADS_REMOVED  = 'adsRemoved';
const PREF_PURCHASE_ID  = 'removeAdsPurchaseId';

/* ─ STATE ─ */
let listenerAttached = false;

/* ─ INIT ─ */
export function initBilling(cb = null) {
  if (listenerAttached) return () => {};
  listenerAttached = true;

  let cleanup = () => {};

  (async () => {
    try {
      await Purchases.configure({ apiKey: RC_PUBLIC_API_KEY, observerMode: false });

      /* ◀- sincronizează token-urile locale cu backend-ul RC */
      await Purchases.syncPurchases();

      /* 1️⃣  Restore */
      const first = await Purchases.restorePurchases();
      await handleCustomerInfo(first, cb);

      /* 2️⃣  Listener unic */
      const id = Purchases.addCustomerInfoUpdateListener((ci) =>
        handleCustomerInfo(ci, cb)
      );

      cleanup = () => {
        Purchases.removeCustomerInfoUpdateListener(id);
        listenerAttached = false;
      };
    } catch (e) {
      console.error('[Billing] init error', e);
    }
  })();

  return () => cleanup();
}

/* ─ BUY ─ */
export async function buyRemoveAds(cb = null) {
  try {
    const { products } = await Purchases.getProducts({
      productIdentifiers: [STORE_PRODUCT_ID],
      type: PRODUCT_CATEGORY.NON_SUBSCRIPTION,
    });
    if (!products?.length) {
      alert('Produsul nu este disponibil momentan.');
      return;
    }

    const { customerInfo, storeTransaction } =
      await Purchases.purchaseStoreProduct({ product: products[0] });

    if (storeTransaction?.revenuecatId) {
      await Preferences.set({
        key: PREF_PURCHASE_ID,
        value: storeTransaction.revenuecatId,
      });
    }

    await handleCustomerInfo(customerInfo, cb);
  } catch (e) {
    if (e?.code === PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR) {
      const info = await Purchases.restorePurchases();
      await handleCustomerInfo(info, cb);
      alert('Achiziţia era deja activă şi a fost restaurată.');
      return;
    }
    if (!e?.userCancelled) alert(e?.message ?? 'Eroare la achiziţie.');
    console.error('[Billing] purchase error', e);
  }
}

/* ─ REFUND (QA) ─ */
export async function refundRemoveAds() {
  const { value: purchaseId } = await Preferences.get({ key: PREF_PURCHASE_ID });
  if (!purchaseId) {
    alert('Nicio achiziţie activă pentru refund.');
    return;
  }
  try {
    const res = await fetch(
      `https://api.revenuecat.com/v2/projects/${RC_PROJECT_ID}/purchases/${purchaseId}/actions/refund`,
      { method: 'POST', headers: { Authorization: `Bearer ${RC_SECRET_API_KEY}` } }
    );
    if (!res.ok) throw new Error(await res.text());
    alert('Refund trimis.');
    await handleCustomerInfo(await Purchases.getCustomerInfo());
  } catch (e) {
    console.error('[Billing] refund error', e);
    alert('Refund a eşuat.');
  }
}

/* ─ HELPERS ─ */
async function handleCustomerInfo(info, cb) {
    const owned =
    /* a) entitlement legat în Dashboard */
    Boolean(info?.entitlements?.active?.[ENTITLEMENT_ID]) ||

    /* b) tranzacție non-subscription prezentă */
    info?.nonSubscriptionTransactions?.some(
      (t) => t.productIdentifier === STORE_PRODUCT_ID
    );

  // Nu suprascriem true cu false
  const { value: old } = await Preferences.get({ key: PREF_ADS_REMOVED });
  if (owned || old !== 'true') {
    await Preferences.set({
      key: PREF_ADS_REMOVED,
      value: owned ? 'true' : 'false',
    });
  }

  // Salvăm purchaseId când există
  const pid = info?.nonSubscriptions?.[STORE_PRODUCT_ID]?.[0]?.purchaseIdentifier;
  if (pid) await Preferences.set({ key: PREF_PURCHASE_ID, value: pid });

  cb?.(owned);
}
