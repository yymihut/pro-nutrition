package com.pronutritionaiteam.NovaNutriCalc;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import com.android.billingclient.api.PendingPurchasesParams;
import androidx.annotation.NonNull;

import com.android.billingclient.api.*;

import java.util.List;

public class BillingManager implements PurchasesUpdatedListener {

    private static final String TAG = "BillingManager";

    /** ID‑ul produsului din Play Console */
    private static final String SKU_REMOVE_ADS = "remove_ads_sku";

    /** Cheie locală pentru a memora dacă user‑ul e premium */
    private static final String PREF_FILE     = "billing_prefs";
    private static final String KEY_PREMIUM   = "is_premium";

    private final BillingClient billingClient;
    private final Context       appCtx;
    private ProductDetails      removeAdsDetails;

    public BillingManager(Context context) {
        this.appCtx = context.getApplicationContext();

        billingClient = BillingClient.newBuilder(appCtx)
                .setListener(this)          // callback‑ul de după plată
                .enablePendingPurchases(
                PendingPurchasesParams
                        .newBuilder()
                        .enableOneTimeProducts()      // pentru in-app non-consumable
                        // .enablePrepaidPlans()      // adaugă dacă vei vinde prepaid-subscriptions
                        .build())

        .build();
        startConnection();
    }

    /* ----------------------------- PUBLIC API ----------------------------- */

    /** Lansează flow‑ul de cumpărare de pe un ecran (Activity) */
    public void launchPurchaseFlow(Activity activity) {
        if (removeAdsDetails == null) {
            Log.w(TAG, "ProductDetails încă nu e gata – re‑încerc");
            queryProductDetails();   // va popula removeAdsDetails
            return;
        }

        BillingFlowParams flowParams =
                BillingFlowParams.newBuilder()
                        .setProductDetailsParamsList(
                                List.of(
                                        BillingFlowParams.ProductDetailsParams
                                                .newBuilder()
                                                .setProductDetails(removeAdsDetails)
                                                .build()
                                )
                        )
                        .build();

        billingClient.launchBillingFlow(activity, flowParams);
    }

    /** Pentru oricine vrea să știe rapid dacă reclamele trebuie arătate */
    public boolean isPremium() {
        SharedPreferences p = appCtx.getSharedPreferences(PREF_FILE, Context.MODE_PRIVATE);
        return p.getBoolean(KEY_PREMIUM, false);
    }

    /* ---------------------------- INTERNALS ------------------------------ */

    private void startConnection() {
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult result) {
                if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    Log.d(TAG, "✅ Billing ready");
                    queryProductDetails();   // pre‑ia prețul / titlul
                    queryExistingPurchases(); // restaurare “Remove Ads”
                }
            }

            @Override public void onBillingServiceDisconnected() {
                Log.w(TAG, "🔌 Billing service disconnected – încerc reconectarea");
            }
        });
    }

    /** Întreabă Play despre detalii (preț, titlu) */
    private void queryProductDetails() {
        QueryProductDetailsParams params =
                QueryProductDetailsParams.newBuilder()
                        .setProductList(
                                List.of(
                                        QueryProductDetailsParams.Product
                                                .newBuilder()
                                                .setProductId(SKU_REMOVE_ADS)
                                                .setProductType(BillingClient.ProductType.INAPP)
                                                .build()
                                )
                        )
                        .build();

        billingClient.queryProductDetailsAsync(params,
                (billingResult, productDetailsList) -> {
                    if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK
                             && !productDetailsList.isEmpty()) {
                                      removeAdsDetails = productDetailsList.get(0);
                                      ProductDetails.OneTimePurchaseOfferDetails priceInfo = removeAdsDetails.getOneTimePurchaseOfferDetails();
                         if (priceInfo != null) {
                                     Log.d(TAG, "ℹ️  Detalii produs primite: "+ priceInfo.getFormattedPrice());
                          }
                      }
                });
    }

    /** Callback după ce user‑ul a trecut prin Google Pay */
    @Override
    public void onPurchasesUpdated(@NonNull BillingResult result,
                                   List<Purchase> purchases) {
        if (result.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase p : purchases) handlePurchase(p);
        } else if (result.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            Log.d(TAG, "⛔️ Achiziție anulată de utilizator");
        } else {
            Log.w(TAG, "❌ Purchase failed: " + result);
        }
    }

    /** Se cheamă și la restore, și imediat după plată */
    private void handlePurchase(Purchase purchase) {
        if (!purchase.getProducts().contains(SKU_REMOVE_ADS)) return;

        if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
            // 1️⃣   Acknowledge (obligatoriu pentru in‑app)
            if (!purchase.isAcknowledged()) {
                AcknowledgePurchaseParams params =
                        AcknowledgePurchaseParams.newBuilder()
                                .setPurchaseToken(purchase.getPurchaseToken())
                                .build();

                billingClient.acknowledgePurchase(params, br -> {
                    if (br.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                        grantPremium();
                    }
                });
            } else {
                grantPremium(); // deja recunoscut pe alt dispozitiv
            }
        }
    }

    /** Marchează local că user‑ul e premium și ascunde reclamele */
    private void grantPremium() {
        SharedPreferences p = appCtx.getSharedPreferences(PREF_FILE, Context.MODE_PRIVATE);
        p.edit().putBoolean(KEY_PREMIUM, true).apply();
        Log.d(TAG, "🎉 Premium activ – reclamele vor fi ascunse");
    }

    /** Restore la fiecare pornire a aplicației */
    private void queryExistingPurchases() {
        billingClient.queryPurchasesAsync(
                QueryPurchasesParams.newBuilder()
                        .setProductType(BillingClient.ProductType.INAPP)
                        .build(),
                (result, purchases) -> {
                    if (result.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                        for (Purchase p : purchases) handlePurchase(p);
                    }
                });
    }

    public void destroy() {
        billingClient.endConnection();
    }
}
