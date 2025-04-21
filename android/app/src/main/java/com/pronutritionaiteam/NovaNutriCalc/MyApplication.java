// MyApplication.java
package com.pronutritionaiteam.NovaNutriCalc;

import android.app.Activity;
import android.app.Application;
import android.app.Application.ActivityLifecycleCallbacks;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.DefaultLifecycleObserver;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ProcessLifecycleOwner;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.RequestConfiguration;
import com.google.android.gms.ads.appopen.AppOpenAd;
import com.google.android.gms.ads.appopen.AppOpenAd.AppOpenAdLoadCallback;

import java.util.Arrays;
import java.util.Date;

/**
 * Application class care iniţializează Google Mobile Ads imediat, încarcă un App‑Open‑Ad
 * şi îl afişează când aplicaţia intră în foreground.
 */
public class MyApplication extends Application
        implements ActivityLifecycleCallbacks, DefaultLifecycleObserver {

    /** Device‑ul real de test – ID obţinut din logcat. În producţie lasă şirul gol. */
    public static final String TEST_DEVICE_HASHED_ID = "59043FEB822E30C97456D5FDDDB5A73D";

    private static final String TAG = "MyApplication";
    private AppOpenAdManager appOpenAdManager = new AppOpenAdManager();  // ① create first;
    private Activity currentActivity;

    //────────────────────────────   APP LIFECYCLE   ────────────────────────────//

    @Override
    public void onCreate() {
        super.onCreate();
        registerActivityLifecycleCallbacks(this);
        ProcessLifecycleOwner.get().getLifecycle().addObserver(this);

        // 1️⃣   Configurează dispozitivul de test (debug only)
        if (!TEST_DEVICE_HASHED_ID.isEmpty()) {
            RequestConfiguration cfg = new RequestConfiguration.Builder()
                    .setTestDeviceIds(Arrays.asList(TEST_DEVICE_HASHED_ID))
                    .build();
            MobileAds.setRequestConfiguration(cfg);
        }

        // 2️⃣   Iniţializează SDK‑ul; după init construieşte AppOpenAdManager
        MobileAds.initialize(this, status -> {
            Log.d(TAG, "MobileAds SDK initializat");
            
            // Dacă avem deja un activity (posibil când onCreate rulează după start Splash)
            if (currentActivity != null) {
                appOpenAdManager.loadAd(currentActivity);
            }
        });
    }

    /** Când aplicaţia reintră în foreground, încearcă să afişeze ad‑ul. */
    @Override
    public void onStart(@NonNull LifecycleOwner owner) {
        if (appOpenAdManager != null && currentActivity != null) {
            appOpenAdManager.showAdIfAvailable(currentActivity);
        }
    }

    //────────────────────────   ACTIVITY CALLBACKS   ──────────────────────────//

    @Override public void onActivityCreated(@NonNull Activity a, @Nullable Bundle b) {}

    @Override public void onActivityStarted(@NonNull Activity activity) {
        if (appOpenAdManager != null && !appOpenAdManager.isShowingAd) {
            currentActivity = activity;
        }
    }

    @Override public void onActivityResumed(@NonNull Activity a) {}
    @Override public void onActivityPaused(@NonNull Activity a) {}
    @Override public void onActivityStopped(@NonNull Activity a) {}
    @Override public void onActivitySaveInstanceState(@NonNull Activity a, @NonNull Bundle s) {}
    @Override public void onActivityDestroyed(@NonNull Activity a) {}

    //──────────────────────────────   HELPERS   ───────────────────────────────//

    /** Expune către Splash/alte activităţi posibilitatea de a încărca manual un ad. */
    public void loadAd(@NonNull Activity activity) {
        if (appOpenAdManager != null) appOpenAdManager.loadAd(activity);
    }

    /** Expune posibilitatea de a afişa ad‑ul imediat ce este gata. */
    public void showAdIfAvailable(@NonNull Activity activity,
                                  @NonNull OnShowAdCompleteListener listener) {
        if (appOpenAdManager != null) appOpenAdManager.showAdIfAvailable(activity, listener);
        else listener.onShowAdComplete();
    }

    public interface OnShowAdCompleteListener { void onShowAdComplete(); }

    //─────────────────────────────   MANAGER   ────────────────────────────────//

    private class AppOpenAdManager {
        private static final String LOG_TAG = "AppOpenAdManager";
        // Unitatea Google de test pentru App‑Open (înlocuieşte cu unitatea ta reală la release)
        private static final String AD_UNIT_ID = "ca-app-pub-3940256099942544/9257395921";

        private AppOpenAd appOpenAd;
        private long loadTime = 0;
        private boolean isLoadingAd = false;
        private boolean isShowingAd = false;

        /*============   PUBLIC  ============*/
        void loadAd(@NonNull Context context) {
            if (isLoadingAd || isAdAvailable()) return;
            isLoadingAd = true;
            AppOpenAd.load(
                    context,
                    AD_UNIT_ID,
                    new AdRequest.Builder().build(),
                    new AppOpenAdLoadCallback() {
                        @Override public void onAdLoaded(@NonNull AppOpenAd ad) {
                            appOpenAd = ad;
                            loadTime = System.currentTimeMillis();
                            isLoadingAd = false;
                            Log.d(LOG_TAG, "onAdLoaded");
                        }
                        @Override public void onAdFailedToLoad(@NonNull LoadAdError err) {
                            isLoadingAd = false;
                            Log.w(LOG_TAG, "onAdFailedToLoad: " + err.getMessage());
                        }
                    });
        }

        void showAdIfAvailable(@NonNull Activity activity) {
            showAdIfAvailable(activity, () -> {});
        }

        void showAdIfAvailable(@NonNull Activity activity,
                               @NonNull OnShowAdCompleteListener listener) {
            if (isShowingAd) return;
            if (!isAdAvailable()) {
                loadAd(activity);
                listener.onShowAdComplete();
                return;
            }
            appOpenAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override public void onAdDismissedFullScreenContent() {
                    reset();
                    listener.onShowAdComplete();
                    loadAd(activity); // preload următorul
                }
                @Override public void onAdFailedToShowFullScreenContent(@NonNull AdError e) {
                    Log.w(LOG_TAG, "onAdFailedToShow: " + e.getMessage());
                    reset();
                    listener.onShowAdComplete();
                    loadAd(activity);
                }
                @Override public void onAdShowedFullScreenContent() { isShowingAd = true; }
            });
            isShowingAd = true;
            appOpenAd.show(activity);
        }

        /*============   UTILITY  ============*/
        boolean isAdAvailable() {
            return appOpenAd != null && (System.currentTimeMillis() - loadTime) < 4 * 60 * 60 * 1000;
        }
        void reset() { appOpenAd = null; isShowingAd = false; }
    }
}
