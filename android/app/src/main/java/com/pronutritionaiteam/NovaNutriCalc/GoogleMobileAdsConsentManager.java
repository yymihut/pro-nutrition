// GoogleMobileAdsConsentManager.java
package com.pronutritionaiteam.NovaNutriCalc;

import android.app.Activity;
import android.content.Context;
import com.google.android.ump.ConsentDebugSettings;
import com.google.android.ump.ConsentForm;
import com.google.android.ump.FormError;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentInformation.PrivacyOptionsRequirementStatus;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

public final class GoogleMobileAdsConsentManager {
    private static GoogleMobileAdsConsentManager instance;
    private final ConsentInformation consentInformation;

    private GoogleMobileAdsConsentManager(Context context) {
        consentInformation = UserMessagingPlatform.getConsentInformation(context);
    }

    public static synchronized GoogleMobileAdsConsentManager getInstance(Context context) {
        if (instance == null) {
            instance = new GoogleMobileAdsConsentManager(context);
        }
        return instance;
    }

    public boolean canRequestAds() {
        return consentInformation.canRequestAds();
    }

    public boolean isPrivacyOptionsRequired() {
        return consentInformation.getPrivacyOptionsRequirementStatus()
                == PrivacyOptionsRequirementStatus.REQUIRED;
    }

    public interface OnConsentGatheringCompleteListener {
        void consentGatheringComplete(FormError error);
    }

    public void gatherConsent(
            Activity activity,
            OnConsentGatheringCompleteListener listener) {
        ConsentDebugSettings debugSettings = new ConsentDebugSettings.Builder(activity)
                .addTestDeviceHashedId(MyApplication.TEST_DEVICE_HASHED_ID)
                .build();
        ConsentRequestParameters params = new ConsentRequestParameters.Builder()
                .setConsentDebugSettings(debugSettings)
                .build();

        consentInformation.requestConsentInfoUpdate(
                activity,
                params,
                () -> UserMessagingPlatform.loadAndShowConsentFormIfRequired(
                        activity,
                        formError -> listener.consentGatheringComplete(formError)
                ),
                error -> listener.consentGatheringComplete(error)
        );
    }

    public void showPrivacyOptionsForm(
            Activity activity,
            ConsentForm.OnConsentFormDismissedListener listener) {
        UserMessagingPlatform.showPrivacyOptionsForm(activity, listener);
    }
}