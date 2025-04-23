import { registerPlugin } from "@capacitor/core";


/* instanțiem pluginul  */
const RemoveAds = registerPlugin("RemoveAds");

/* 1. verificăm la pornire dacă user‑ul e premium */
export async function isPremium() {
  try {
    const { value } = await RemoveAds.isPremium();
    return value;
  } catch (e) {
    console.error("isPremium failed", e);
    return false;
  }
}

/* 2. fluxul de cumpărare */
export async function buy() {
  try {
    await RemoveAds.purchase(); // deschide Google Play Billing
    return await isPremium(); //   re‑verificăm după plată
  } catch (e) {
    console.error("purchase failed", e);
    return false;
  }
}

/* 3. (opțional) expune funcțiile în global – dacă nu folosești bundler */
window.ensureNoAds = isPremium;
window.buyRemoveAds = buy;
