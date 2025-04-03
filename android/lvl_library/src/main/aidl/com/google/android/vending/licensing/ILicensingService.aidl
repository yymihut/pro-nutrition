package com.google.android.vending.licensing;

import com.google.android.vending.licensing.ILicenseResultListener;

interface ILicensingService {
    void checkLicense(long nonce, String packageName, ILicenseResultListener listener);
}
