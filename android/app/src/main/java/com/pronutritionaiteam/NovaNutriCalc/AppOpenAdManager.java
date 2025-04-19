package com.pronutritionaiteam.NovaNutriCalc;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.appopen.AppOpenAd;
import com.google.android.gms.ads.appopen.AppOpenAd.AppOpenAdLoadCallback;
import com.google.android.gms.ads.FullScreenContentCallback;
import java.util.Date;

/** Clasă care încarcă și afișează App Open Ads */
public class AppOpenAdManager {
    private static final String LOG_TAG = "AppOpenAdManager";
    // Folosește ID‑ul de test în dezvoltare:
    private static final String AD_UNIT_ID = "ca-app-pub-3940256099942544/9257395921";
    private AppOpenAd appOpenAd = null;
    private boolean isLoading = false;
    private boolean isShowing = false;
    private long loadTime;

    /** Încarcă un ad dacă nu e deja încărcat sau în curs */
    public void loadAd(Context context) {
        if (isLoading || appOpenAd != null) return;
        isLoading = true;
        AdRequest request = new AdRequest.Builder().build();
        AppOpenAd.load(
            context, AD_UNIT_ID, request,
            AppOpenAd.APP_OPEN_AD_ORIENTATION_PORTRAIT,
            new AppOpenAdLoadCallback() {
                @Override
                public void onAdLoaded(AppOpenAd ad) {
                    Log.d(LOG_TAG, "Ad loaded");
                    appOpenAd = ad;
                    loadTime = new Date().getTime();
                    isLoading = false;
                }
                @Override
                public void onAdFailedToLoad(AdError error) {
                    Log.d(LOG_TAG, "Failed to load ad: " + error.getMessage());
                    isLoading = false;
                }
            }
        );
    }

    /** Afișează ad-ul dacă e disponibil și nu expiră (4h) */
    public void showAdIfAvailable(Activity activity, OnShowAdCompleteListener listener) {
        if (isShowing) return;
        if (appOpenAd == null || new Date().getTime() - loadTime > 4 * 3600000) {
            listener.onShowAdComplete();
            loadAd(activity);
            return;
        }
        appOpenAd.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override
            public void onAdDismissedFullScreenContent() {
                Log.d(LOG_TAG, "Ad dismissed");
                appOpenAd = null;
                isShowing = false;
                listener.onShowAdComplete();
                loadAd(activity);
            }
            @Override
            public void onAdFailedToShowFullScreenContent(AdError error) {
                Log.d(LOG_TAG, "Ad failed to show: " + error.getMessage());
                appOpenAd = null;
                isShowing = false;
                listener.onShowAdComplete();
                loadAd(activity);
            }
            @Override
            public void onAdShowedFullScreenContent() {
                Log.d(LOG_TAG, "Ad showed");
            }
        });
        isShowing = true;
        appOpenAd.show(activity);
    }

    /** Callback pentru terminarea afișării */
    public interface OnShowAdCompleteListener {
        void onShowAdComplete();
    }
}
