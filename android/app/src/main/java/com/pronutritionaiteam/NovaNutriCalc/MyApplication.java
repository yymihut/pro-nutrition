package com.pronutritionaiteam.NovaNutriCalc;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import android.util.Log;
import com.google.android.gms.ads.MobileAds;

public class MyApplication extends Application
        implements Application.ActivityLifecycleCallbacks {

    private static final String LOG_TAG = "MyApplication";

    private AppOpenAdManager appOpenAdManager;
    private BillingManager    billingManager;    // ➊

    public BillingManager getBillingManager() {  // ➋  acces global
        return billingManager;
    }
    private Activity currentActivity;

    // ❶  Ținem un getter simplu – FĂRĂ @Override
    public Activity getCurrentActivity() {
        return currentActivity;
    }
    

    @Override
    public void onCreate() {
        super.onCreate();
        registerActivityLifecycleCallbacks(this);
        billingManager   = new BillingManager(this);     // ➌

        // ❷  Pasăm referința aplicației în constructor
        appOpenAdManager = new AppOpenAdManager(this);

        MobileAds.initialize(this, status -> {
            Log.d(LOG_TAG, "📦 MobileAds initializat");
            appOpenAdManager.loadAd(this);
        });
    }
    @Override
    public void onTerminate() {
        super.onTerminate();
        billingManager.destroy();   // bun‑simț
    }

    @Override
    public void onActivityResumed(Activity activity) {
        currentActivity = activity;
        currentActivity = activity;
        appOpenAdManager.showAdIfAvailable(activity);   // no postDelayed, no second path
        // la reluare rămâne logica existentă
        /* activity.getWindow().getDecorView().postDelayed(() -> {
            if (activity.hasWindowFocus()) {
                appOpenAdManager.showAdIfAvailable(activity);
            }
        }, 900); */
    }

    /* celelalte metode din ActivityLifecycleCallbacks pot rămâne goale */
    @Override public void onActivityCreated(Activity a, Bundle b) {}
    @Override public void onActivityStarted(Activity a) {}
    @Override public void onActivityPaused(Activity a) {}
    @Override public void onActivityStopped(Activity a) {}
    @Override public void onActivitySaveInstanceState(Activity a, Bundle b) {}
    @Override public void onActivityDestroyed(Activity a) {}
}
