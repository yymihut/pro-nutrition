package com.google.android.vending.licensing;

public class LicenseValidator {
    private final Policy policy;
    private final DeviceLimiter deviceLimiter;
    private final LicenseChecker callback;

    public LicenseValidator(Policy policy, DeviceLimiter limiter, LicenseChecker callback) {
        this.policy = policy;
        this.deviceLimiter = limiter;
        this.callback = callback;
    }

    public LicenseChecker getCallback() {
        return callback;
    }
}