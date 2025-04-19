package com.pronutritionaiteam.NovaNutriCalc;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.lifecycle.DefaultLifecycleObserver;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.ProcessLifecycleOwner;
import com.google.android.gms.ads.MobileAds;

/** Aplicație care inițializează și afișează App Open Ads */
public class MyApplication extends Application implements Application.ActivityLifecycleCallbacks, DefaultLifecycleObserver {
    private static final String TAG = "MyApplication";
    private AppOpenAdManager appOpenAdManager;
    private Activity currentActivity;

    @Override
    public void onCreate() {
        super.onCreate();

        // 1) Înregistrăm callback-urile pentru Activity
        registerActivityLifecycleCallbacks(this);

        // 2) Inițializăm SDK-ul Google Mobile Ads în fundal
        new Thread(() -> MobileAds.initialize(this, initializationStatus -> {
            Log.d(TAG, "SDK Mobile Ads initialized");
        })).start();

        // 3) Ascultăm evenimentul ON_START al procesului (foreground)
        ProcessLifecycleOwner.get().getLifecycle().addObserver(this);

        // 4) Creăm managerul de App Open Ads
        appOpenAdManager = new AppOpenAdManager();
        // Preîncărcăm un ad chiar la pornire
        appOpenAdManager.loadAd(this);
    }

    // ---------------- LifecycleObserver ----------------
    @Override
    public void onStart(@NonNull LifecycleOwner owner) {
        // De fiecare dată când aplicația trece în foreground
        if (currentActivity != null) {
            appOpenAdManager.showAdIfAvailable(currentActivity, () -> {
                // callback gol: rămâne pe ecranul curent
            });
        }
    }

    // ---------------- ActivityLifecycleCallbacks ----------------
    @Override public void onActivityStarted(Activity activity) { currentActivity = activity; }
    @Override public void onActivityCreated(Activity activity, Bundle savedInstanceState) {}
    @Override public void onActivityResumed(Activity activity) {}
    @Override public void onActivityPaused(Activity activity) {}
    @Override public void onActivityStopped(Activity activity) {}
    @Override public void onActivitySaveInstanceState(Activity activity, Bundle outState) {}
    @Override public void onActivityDestroyed(Activity activity) {}
}
