package com.pronutritionaiteam.NovaNutriCalc;

import android.app.Activity;
import android.util.Log;
import androidx.annotation.NonNull;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.appopen.AppOpenAd;
import android.os.Handler;
import android.os.Looper;

public class AppOpenAdManager {

    private static final String LOG_TAG = "AppOpenAdManager";
    private static final String AD_UNIT_ID = "ca-app-pub-3940256099942544/9257395921"; // test

    // ❸  Primim referința aplicației pentru a obține activity curent
    private final MyApplication app;
    public AppOpenAdManager(MyApplication app) {
        this.app = app;
    }

    private AppOpenAd appOpenAd;
    private boolean isLoadingAd = false;
    private boolean isShowingAd = false;
    private long loadTime = 0;

    // AppOpenAdManager.java  (în interiorul clasei, sub celelalte variabile)
private static final long COOLDOWN_MS = 30_000;   // 30 s
private long lastShown = 0;

private boolean shouldShow() {
    return System.currentTimeMillis() - lastShown > COOLDOWN_MS;
}

    public void loadAd(android.content.Context context) {
        if (isLoadingAd || isAdAvailable()) return;

        isLoadingAd = true;
        AdRequest request = new AdRequest.Builder().build();

        AppOpenAd.load(context, AD_UNIT_ID, request,
            AppOpenAd.APP_OPEN_AD_ORIENTATION_PORTRAIT,
            new AppOpenAd.AppOpenAdLoadCallback() {

                @Override
                public void onAdLoaded(@NonNull AppOpenAd ad) {
                    Log.d(LOG_TAG, "✅ Ad încărcat");
                    appOpenAd  = ad;
                    isLoadingAd = false;
                    loadTime    = System.currentTimeMillis();

                    // în onAdLoaded(), înlocuieşte blocul care decide afişarea
                    Activity activity = app.getCurrentActivity();
                    long timeSinceLast = System.currentTimeMillis() - lastShown;
                    long delay        = COOLDOWN_MS - timeSinceLast;

                    if (delay <= 0) {                // cool‑down deja expirat
                         if (activity != null && activity.hasWindowFocus()) {
                           showAdIfAvailable(activity);
                                }
                        } else {                         // încă suntem în cool‑down
                          new Handler(Looper.getMainLooper())
                              .postDelayed(() -> {
                               Activity act = app.getCurrentActivity();
                              if (act != null && act.hasWindowFocus()) {
                                     showAdIfAvailable(act);          // va trece de shouldShow()
                                  }
                 }, delay);
                    Log.d(LOG_TAG, "⏳ Ad gata, îl afişez peste " + delay + " ms");
                     }
                }

                @Override
                public void onAdFailedToLoad(@NonNull LoadAdError e) {
                    Log.e(LOG_TAG, "❌ Eroare la încărcare: " + e);
                    isLoadingAd = false;
               }
        });
    }
    //o metodă de a preveni afișarea unor reclame stocate prea mult timp, 
    //care ar putea expira sau fi invalide.
    private boolean isAdAvailable() {
        return appOpenAd != null
               && (System.currentTimeMillis() - loadTime) < 15_000;
               // (System.currentTimeMillis() - loadTime) < 2 * 60 * 60 * 1000;
    }

 public void showAdIfAvailable(Activity activity) {
    // respectă cool‑down‑ul
    if (!shouldShow()) {
        Log.d(LOG_TAG, "⌛ Cool‑down activ – nu afişez ad încă");
        return;
    }

    if (isShowingAd) {
        Log.d(LOG_TAG, "🚫 Deja se afişează un ad");
        return;
    }

    if (!isAdAvailable()) {
        Log.d(LOG_TAG, "📭 Niciun ad disponibil – încarc unul nou");
        loadAd(activity);
        return;
    }

        appOpenAd.setFullScreenContentCallback(new FullScreenContentCallback() {
        @Override
        public void onAdShowedFullScreenContent() {
            isShowingAd = true;
            lastShown   = System.currentTimeMillis();   // marchează momentul afişării
            Log.d(LOG_TAG, "📢 Ad afişat");
        }

      @Override
public void onAdDismissedFullScreenContent() {
    appOpenAd = null;
    isShowingAd = false;

    long timeSinceLast = System.currentTimeMillis() - lastShown;
    long delay = COOLDOWN_MS - timeSinceLast;

    new Handler(Looper.getMainLooper()).postDelayed(() -> {
        Activity act = app.getCurrentActivity();
        if (act != null && act.hasWindowFocus()) {
            showAdIfAvailable(act);  // va trece de shouldShow
        }
    }, Math.max(delay, 0));

    loadAd(activity);  // încarcă imediat următorul
}

        @Override
        public void onAdFailedToShowFullScreenContent(
                com.google.android.gms.ads.AdError adError) {
            appOpenAd = null;
            isShowingAd = false;
            lastShown = System.currentTimeMillis(); // evită blocarea cooldown-ului
        }
    });

        appOpenAd.show(activity);
    }
}
