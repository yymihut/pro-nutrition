package com.pronutritionaiteam.NovaNutriCalc.licensing;

import android.content.Context;
import com.google.android.vending.licensing.AESObfuscator;
import com.google.android.vending.licensing.LicenseChecker;
import com.google.android.vending.licensing.LicenseCheckerCallback;
import com.google.android.vending.licensing.Policy;
import com.google.android.vending.licensing.ServerManagedPolicy;

public class LicenseCheckerUtil {
    
private static final String BASE64_PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlhTtYNmHlkDizHPcBv7+pc8Bs/aMmMV5EaMavhqCEWbFod2Fhznt8D+9G0b0JTyLCqCWdaO+8B+yUOVxl//KXALtdi84myFx/bZip20J5qcMy52e0K/Kz/H/KOKu8aAt5OmSkbWKEOBNWETSFCXFvtNiM6mKmWi1keXeEPkYoVq9bJ6pMDgpKjzV+EeVZOjEb0kWLdf2mGJCyy1SknuKwbl+zJk/7cmNsLm0VwdeQG6LjMJ0/f/4xFfte5M5rIqmEmvxaT5DhqOqBrNwqqd1TJa6mgJmcSfjXnN5m4Yjs9iz0orqnc78Sger5DdHL+fnYDTUaaqnbal+e15fLc3YrwIDAQAB"; // Replace with your actual key
   private final LicenseChecker mChecker;
       private static final byte[] SALT = new byte[] {
        -46, 12, 98, -112, 54, -1, 34, -86, 76, -55, 45, -13, 11, -89, 35, -12, -4, 56, 75, -122
    };
   
  public LicenseCheckerUtil(Context context, LicenseCheckerCallback callback) {
        Policy policy = new ServerManagedPolicy(context, new AESObfuscator(SALT, context.getPackageName(), android.provider.Settings.Secure.getString(context.getContentResolver(), android.provider.Settings.Secure.ANDROID_ID)));
        mChecker = new LicenseChecker(context, policy, BASE64_PUBLIC_KEY);
        mChecker.checkAccess(callback);
    }

    public void destroy() {
        mChecker.onDestroy();
    }
}