package com.pronutritionaiteam.NovaNutriCalc.licensing;

import android.util.Log;
import android.content.Context;
import com.google.android.vending.licensing.LicenseCheckerCallback;

public class MyLicenseCheckerCallback implements LicenseCheckerCallback {

    private static final String TAG = "LicenseCallback";
    private Context context;

    // Constructor care primește contextul din MainActivity
    public MyLicenseCheckerCallback(Context context) {
        this.context = context;
    }

    @Override
    public void allow(int reason) {
        Log.d(TAG, "License granted! Reason: " + reason);
        // You can unlock premium functionality here
    }

    @Override
    public void doNotAllow(int reason) {
        Log.w(TAG, "License denied. Reason: " + reason);
        // Handle app restriction if needed
    }

    @Override
    public void applicationError(int errorCode) {
        Log.e(TAG, "License check error. Code: " + errorCode);
        // Handle failure communicating with license server
    }
}
