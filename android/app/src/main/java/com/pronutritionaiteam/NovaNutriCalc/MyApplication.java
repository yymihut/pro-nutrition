// MyApplication.java
//public static final String TEST_DEVICE_HASHED_ID = "59043FEB822E30C97456D5FDDDB5A73D";

// MyApplication.java
package com.pronutritionaiteam.NovaNutriCalc;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleObserver;
import androidx.lifecycle.OnLifecycleEvent;
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
 * Application class that shows an App‑Open ad whenever
 * aplicația trece în prim‑plan.
 */
public class MyApplication extends Application
        implements Application.ActivityLifecycleCallbacks, LifecycleObserver {

    // Test‑device ID (hash) – lasă‑l doar în faza de testare
    public static final String TEST_DEVICE_HASHED_ID = "59043FEB822E30C97456D5FDDDB5A73D";

    private AppOpenAdManager appOpenAdManager;
    private Activity currentActivity;

    /* --------------------- ciclul de viață Application --------------------- */

    @Override
    public void onCreate() {
        super.onCreate();

        // 1) Inițializează Mobile Ads pe UI thread
        MobileAds.initialize(this, initializationStatus -> {
            Log.d("MyApplication", "MobileAds init complet.");
            // 2) După init, încarcă prima reclamă
            appOpenAdManager.loadAd(this);
        });

        // 3) Configurează dispozitivele de test
        RequestConfiguration config = new RequestConfiguration.Builder()
                .setTestDeviceIds(Arrays.asList(TEST_DEVICE_HASHED_ID))
                .build();
        MobileAds.setRequestConfiguration(config);

        // 4) Observă viața aplicației + activitățile
        registerActivityLifecycleCallbacks(this);
        ProcessLifecycleOwner.get().getLifecycle().addObserver(this);

        appOpenAdManager = new AppOpenAdManager();
    }

    /* --------------------- când aplicația revine în prim‑plan --------------------- */

    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    public void onMoveToForeground() {
        appOpenAdManager.showAdIfAvailable(
                currentActivity,
                () -> Log.d("MyApplication", "AppOpen ad terminat sau indisponibil")
        );
    }

    /* --------------------- callbacks ActivityLifecycle --------------------- */

    @Override public void onActivityStarted(@NonNull Activity activity) { currentActivity = activity; }
    @Override public void onActivityCreated(@NonNull Activity activity, Bundle b) { }
    @Override public void onActivityResumed(@NonNull Activity activity) { }
    @Override public void onActivityPaused(@NonNull Activity activity) { }
    @Override public void onActivityStopped(@NonNull Activity activity) { }
    @Override public void onActivitySaveInstanceState(@NonNull Activity a, @NonNull Bundle b) { }
    @Override public void onActivityDestroyed(@NonNull Activity activity) { }

    /* --------------------- manager App Open Ads --------------------- */

    private static class AppOpenAdManager {
        private static final String TAG = "AppOpenAdManager";
        // unit‑id de TEST – schimbă‑l în producție!
        private static final String AD_UNIT_ID = "ca-app-pub-3940256099942544/9257395921";

        private AppOpenAd appOpenAd;
        private long loadTimeMillis = 0L;
        private boolean isLoading    = false;
        private boolean isShowing    = false;

        /** Încărcăm o reclamă dacă nu avem deja una validă */
        void loadAd(Context context) {
            if (isLoading || isAdAvailable()) return;

            isLoading = true;
            AdRequest request = new AdRequest.Builder().build();
            AppOpenAd.load(
                    context,
                    AD_UNIT_ID,
                    request,
                    new AppOpenAdLoadCallback() {
                        @Override
                        public void onAdLoaded(@NonNull AppOpenAd ad) {
                            appOpenAd = ad;
                            loadTimeMillis = System.currentTimeMillis();
                            isLoading = false;
                            Log.d(TAG, "AppOpen ad încărcat cu succes");
                        }

                        @Override
                        public void onAdFailedToLoad(@NonNull LoadAdError err) {
                            isLoading = false;
                            Log.w(TAG, "Eroare la load: " + err.getCode() + " – " + err.getMessage());
                        }
                    }
            );
        }

        /** Valabil timp de 4 ore de la încărcare */
        boolean isAdAvailable() {
            long ageMillis = System.currentTimeMillis() - loadTimeMillis;
            return appOpenAd != null && ageMillis < 4 * 60 * 60 * 1000L;
        }

        /** Afișează reclama sau continuă execuția imediat */
        void showAdIfAvailable(@NonNull Activity activity, @NonNull Runnable onFinish) {
            if (isShowing) { onFinish.run(); return; }

            if (!isAdAvailable()) {
                Log.d(TAG, "Nicio reclamă disponibilă – încarc una nouă");
                onFinish.run();
                loadAd(activity);
                return;
            }

            appOpenAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                @Override public void onAdShowedFullScreenContent() { isShowing = true; }
                @Override public void onAdDismissedFullScreenContent() { resetAndContinue(activity, onFinish); }
                @Override public void onAdFailedToShowFullScreenContent(@NonNull AdError err) {
                    Log.w(TAG, "Eroare la show: " + err.getCode() + " – " + err.getMessage());
                    resetAndContinue(activity, onFinish);
                }
            });

            appOpenAd.show(activity);
        }

        private void resetAndContinue(Context ctx, Runnable onFinish) {
            appOpenAd = null;
            isShowing = false;
            onFinish.run();
            loadAd(ctx); // pregătește următoarea
        }
    }
}