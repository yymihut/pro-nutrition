package com.google.android.vending.licensing;

public interface LicenseCheckerCallback {
    void allow(int reason);
    void doNotAllow(int reason);
    void applicationError(int errorCode);
}
