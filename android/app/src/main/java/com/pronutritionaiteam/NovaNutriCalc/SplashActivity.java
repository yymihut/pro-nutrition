// SplashActivity.java
package com.pronutritionaiteam.NovaNutriCalc;

import android.annotation.SuppressLint;
import android.app.Application;
import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.RequestConfiguration;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

public class SplashActivity extends AppCompatActivity {

    private static final String LOG_TAG = "SplashActivity";
    private static final long COUNTER_TIME_MILLISECONDS = 8000;

    private AtomicBoolean isMobileAdsInitializeCalled = new AtomicBoolean(false);
    private AtomicBoolean gatherConsentFinished = new AtomicBoolean(false);
    private GoogleMobileAdsConsentManager googleMobileAdsConsentManager;
    private long secondsRemaining;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        createTimer();

        googleMobileAdsConsentManager =
                GoogleMobileAdsConsentManager.getInstance(getApplicationContext());
        googleMobileAdsConsentManager.gatherConsent(
                this,
                consentError -> {
                    if (consentError != null) {
                        Log.w(LOG_TAG, consentError.getMessage());
                    }
                    gatherConsentFinished.set(true);
                    if (googleMobileAdsConsentManager.canRequestAds()) {
                        initializeMobileAdsSdk();
                    }
                    if (secondsRemaining <= 0) {
                        startMainActivity();
                    }
                });

        if (googleMobileAdsConsentManager.canRequestAds()) {
            initializeMobileAdsSdk();
        }
    }

    private void createTimer() {
        TextView counterTextView = findViewById(R.id.timer);
        new CountDownTimer(COUNTER_TIME_MILLISECONDS, 1000) {
            @SuppressLint("SetTextI18n")
            @Override
            public void onTick(long millisUntilFinished) {
                secondsRemaining = TimeUnit.MILLISECONDS.toSeconds(millisUntilFinished) + 1;
                counterTextView.setText("App is done loading in: " + secondsRemaining);
            }

            @Override
            public void onFinish() {
                secondsRemaining = 0;
                counterTextView.setText("Done.");
                ((MyApplication) getApplication())
                        .showAdIfAvailable(SplashActivity.this, SplashActivity.this::startMainActivity);
            }
        }.start();
    }

    private void initializeMobileAdsSdk() {
        if (isMobileAdsInitializeCalled.getAndSet(true)) return;
    }

    private void startMainActivity() {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();
    }
}