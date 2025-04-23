package com.pronutritionaiteam.NovaNutriCalc;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.appopen.AppOpenAd;
import com.pronutritionaiteam.removeads.RemoveAdsPlugin;

/**
 * Manages loading and showing Google App Open Ads using Mobile Ads SDK 24.0.0+
 *
 * Changes for 24.0.0:
 * • Removed AppOpenAdLoadConfiguration – AppOpenAd.load now takes an AdRequest directly.
 * • Orientation constants have been removed; orientation is handled automatically.
 * • API level 23+ is required by SDK‑24, so minSdkVersion must be 23.
 */
public class AppOpenAdManager {

    private static final String LOG_TAG = "AppOpenAdManager";

    /** Test ad‑unit; replace with your own live ID before publishing */
    private static final String AD_UNIT_ID = "ca-app-pub-3940256099942544/9257395921";

    // Reference to custom Application class for retrieving the current activity
    private final MyApplication app;

    public AppOpenAdManager(MyApplication app) {
        this.app = app;
    }

    private AppOpenAd appOpenAd;
    private boolean isLoadingAd = false;
    private boolean isShowingAd = false;
    private long    loadTime    = 0;

    /** Cool‑down between two consecutive impressions (ms) */
    private static final long COOLDOWN_MS = 30_000;
    private long lastShown = 0;

    private boolean shouldShow() {
        return System.currentTimeMillis() - lastShown > COOLDOWN_MS;
    }

    /** Initiates an async load if none is in progress & no valid ad cached */
    public void loadAd(Context context) {
        if (isLoadingAd || isAdAvailable()) return;

        isLoadingAd = true;

        AdRequest request = new AdRequest.Builder().build();

        AppOpenAd.load(
                context,
                AD_UNIT_ID,
                request,
                new AppOpenAd.AppOpenAdLoadCallback() {

                    @Override
                    public void onAdLoaded(@NonNull AppOpenAd ad) {
                        Log.d(LOG_TAG, "✅ Ad loaded");
                        appOpenAd  = ad;
                        isLoadingAd = false;
                        loadTime    = System.currentTimeMillis();

                        Activity activity = app.getCurrentActivity();
                        long timeSinceLast = System.currentTimeMillis() - lastShown;
                        long delay         = COOLDOWN_MS - timeSinceLast;

                        if (delay <= 0) {
                            if (activity != null && activity.hasWindowFocus()) {
                                showAdIfAvailable(activity);
                            }
                        } else {
                            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                                Activity act = app.getCurrentActivity();
                                if (act != null && act.hasWindowFocus()) {
                                    showAdIfAvailable(act);
                                }
                            }, delay);
                            Log.d(LOG_TAG, "⏳ Ad ready, will show in " + delay + " ms");
                        }
                    }

                    @Override
                    public void onAdFailedToLoad(@NonNull LoadAdError e) {
                        Log.e(LOG_TAG, "❌ Failed to load: " + e);
                        isLoadingAd = false;
                    }
                });
    }

    /** Returns true if we have an ad that has not expired (15 min) */
    private boolean isAdAvailable() {
        return appOpenAd != null && (System.currentTimeMillis() - loadTime) < 15 * 60 * 1000;
    }

    /** Shows the ad if one is cached and all conditions allow it */
    public void showAdIfAvailable(Activity activity) {
        /* NEW: dacă user‑ul a plătit, ieșim imediat */
        if (app.getBillingManager().isPremium()) {
        Log.d(LOG_TAG, "👑 Premium – nu mai afișăm ad‑uri");
        return;
            }
        // respect cool‑down
        if (!shouldShow()) {
            Log.d(LOG_TAG, "⌛ Cool‑down active – won't show ad yet");
            return;
        }

        if (isShowingAd) {
            Log.d(LOG_TAG, "🚫 An ad is already showing");
            return;
        }

        if (!isAdAvailable()) {
            Log.d(LOG_TAG, "📭 No ad available – invoking load");
            loadAd(activity);
            return;
        }

        appOpenAd.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override
            public void onAdShowedFullScreenContent() {
                isShowingAd = true;
                lastShown   = System.currentTimeMillis();
                Log.d(LOG_TAG, "📢 Ad showed");
            }

            @Override
            public void onAdDismissedFullScreenContent() {
                appOpenAd  = null;
                isShowingAd = false;

                long timeSinceLast = System.currentTimeMillis() - lastShown;
                long delay = COOLDOWN_MS - timeSinceLast;

                new Handler(Looper.getMainLooper()).postDelayed(() -> {
                    Activity act = app.getCurrentActivity();
                    if (act != null && act.hasWindowFocus()) {
                        showAdIfAvailable(act); // will pass shouldShow
                    }
                }, Math.max(delay, 0));

                loadAd(activity); // preload next
            }

            @Override
            public void onAdFailedToShowFullScreenContent(com.google.android.gms.ads.AdError adError) {
                appOpenAd = null;
                isShowingAd = false;
                lastShown = System.currentTimeMillis(); // avoid blocking cool‑down
            }
        });

        appOpenAd.show(activity);
    }
}