package com.pronutritionaiteam.NovaNutriCalc;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.appopen.AppOpenAd;

/**
 * Manages loading and showing Google App-Open Ads.
 * – ad-unitul din test este „ca-app-pub-3940256099942544/9257395921”.
 */
public class AppOpenAdManager
        implements SharedPreferences.OnSharedPreferenceChangeListener {

    /*––––––––––– Config & state –––––––––––*/
    private static final String LOG_TAG    = "AppOpenAdManager";
    private static final String PREFS_NAME = "CapacitorStorage";
    private static final String ADS_KEY    = "adsRemoved";
    private static final String AD_UNIT_ID = "ca-app-pub-3940256099942544/9257395921";

    private final MyApplication  app;
    private final SharedPreferences prefs;

    /* Se actualizează din listener-ul de mai jos */
    private volatile boolean adsRemoved;

    private AppOpenAd appOpenAd;
    private boolean   isLoadingAd  = false;
    private boolean   isShowingAd  = false;
    private long      loadTime     = 0;

    private static final long COOLDOWN_MS = 45_000;
    private long lastShown = 0;

    private static final long LOAD_TIMEOUT_MS = 10_000;      // 10 s
    private final Handler handler = new Handler(Looper.getMainLooper());
    private Runnable timeoutTask  = null;
    private Runnable showLaterTask = null;

    /*––––––––––– Constructor –––––––––––*/
    public AppOpenAdManager(MyApplication app) {
        this.app  = app;
        this.prefs = app.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        Log.d(LOG_TAG, "🔄 [AppOpenAdManager] this.prefs = app.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);--: " + this.prefs );
        // 1️⃣ citire iniţială
        adsRemoved = "true".equals(prefs.getString(ADS_KEY, "false"));

        // 2️⃣ ascultăm toate modificările făcute de partea JS
        prefs.registerOnSharedPreferenceChangeListener(this);
    }

    /*––––––––––– SharedPreferences callback –––––––––––*/
    @Override
    public void onSharedPreferenceChanged(SharedPreferences sp, String key) {
        Log.d(LOG_TAG, "🔄 [AppOpenAdManager] if (!ADS_KEY.equals(key)) return; --: " + ADS_KEY + key );
        
        if (!ADS_KEY.equals(key)) return;

        boolean newValue = "true".equals(sp.getString(ADS_KEY, "false"));
        if (newValue == adsRemoved) return;           // nimic nou

        adsRemoved = newValue;
        Log.d(LOG_TAG, "🔄 [AppOpenAdManager] adsRemoved set to " + adsRemoved);

        // Dacă user-ul a primit refund: renunţăm la orice ad pre-încărcat
        if (!isShowingAd && adsRemoved && appOpenAd != null) {
            Log.d(LOG_TAG, "🔄 [AppOpenAdManager] if (!isShowingAd && adsRemoved && appOpenAd != null) { " + !isShowingAd + adsRemoved + appOpenAd);
            appOpenAd = null;
        }

        // Dacă user-ul NU mai deţine produsul, forţăm încărcarea unei reclame
        if (!adsRemoved) {
            loadAd(app.getApplicationContext());
        }
    }

    /*––––––––––– Utilitar –––––––––––*/
    private boolean shouldShow() {
        return !adsRemoved && (System.currentTimeMillis() - lastShown > COOLDOWN_MS);
    }

    /*––––––––––– Public API –––––––––––*/
    public void loadAd(Context ctx) {
        if (adsRemoved || isLoadingAd || isAdAvailable()) return;

    isLoadingAd = true;

    /*––––  Îmbunătățirea #1 – timeout pe încărcare  ––––*/
    timeoutTask = () -> {
        if (isLoadingAd) {
            Log.w(LOG_TAG, "⏰ [AppOpenAdManager] Ad-load timeout");
            isLoadingAd = false;
        }
    };
    handler.postDelayed(timeoutTask, LOAD_TIMEOUT_MS);

    AppOpenAd.load(
        ctx,
        AD_UNIT_ID,
        new AdRequest.Builder().build(),
        new AppOpenAd.AppOpenAdLoadCallback() {
                
            @Override public void onAdLoaded(@NonNull AppOpenAd ad) {
                // 3️ – ştergem timeout-ul
                if (timeoutTask != null) handler.removeCallbacks(timeoutTask);

                Log.d(LOG_TAG, "✅ [AppOpenAdManager]  Ad loaded");
                appOpenAd  = ad;
                isLoadingAd = false;
                loadTime    = System.currentTimeMillis();

                /*––––  Îmbunătățirea #2 – afişare după cool-down  ––––*/
                long delay = COOLDOWN_MS - (System.currentTimeMillis() - lastShown);
                Activity current = app.getCurrentActivity();

                if (delay <= 0) {
                    if (current != null && current.hasWindowFocus()) {
                        showAdIfAvailable(current);
                    }
                } else {
                    // 3️ – anulăm orice alt callback „showLater” existent
                    if (showLaterTask != null) handler.removeCallbacks(showLaterTask);

                    showLaterTask = () -> {
                        Activity again = app.getCurrentActivity();
                        if (again != null && again.hasWindowFocus()) {
                            showAdIfAvailable(again);
                        }
                    };
                    handler.postDelayed(showLaterTask, delay);
                    Log.d(LOG_TAG, "⏳ [AppOpenAdManager] Ad ready, will show in " + delay + " ms");
                }
            }
                @Override public void onAdFailedToLoad(@NonNull LoadAdError e) {
                    if (timeoutTask != null) handler.removeCallbacks(timeoutTask);  // 3️
                    Log.e(LOG_TAG, "❌  Failed to load: " + e);
                    isLoadingAd = false;
                }
                  });
             }

                public void showAdIfAvailable(Activity activity) {
                    if (!shouldShow()) {
                           return;
                        }

                    if (!isAdAvailable()) {
                           loadAd(activity);
                           return;
                         }

                    appOpenAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                         @Override public void onAdShowedFullScreenContent() {
                             isShowingAd = true;
                             lastShown   = System.currentTimeMillis();
                          }
                         @Override public void onAdDismissedFullScreenContent() {
                              isShowingAd = false;
                              appOpenAd   = null;
                              loadAd(activity);                      // pre-încarcă următoarea
                           }
                          @Override public void onAdFailedToShowFullScreenContent(
                               com.google.android.gms.ads.AdError err) {
                                isShowingAd = false;
                                appOpenAd   = null;
                             }
                    });

                    appOpenAd.show(activity);
                }

    /*––––––––––– Helpers –––––––––––*/
    private boolean isAdAvailable() {
        return appOpenAd != null &&
               (System.currentTimeMillis() - loadTime) < 15 * 60 * 1000;
    }

    /*––––––––––– Cleanup (dacă vrei) –––––––––––*/
    public void dispose() {
        prefs.unregisterOnSharedPreferenceChangeListener(this);
    }
}
