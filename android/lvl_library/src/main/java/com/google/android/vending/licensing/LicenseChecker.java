package com.google.android.vending.licensing;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;
import com.google.android.vending.licensing.ILicensingService;
import com.google.android.vending.licensing.ILicenseResultListener;

public class LicenseChecker {

    private static final String TAG = "LicenseChecker";

    private final Context mContext;
    private final Policy mPolicy;
    private final String mPublicKey;
    private ILicensingService mService;
    private LicenseCheckerCallback mCallback;

    public LicenseChecker(Context context, Policy policy, String publicKey) {
        mContext = context;
        mPolicy = policy;
        mPublicKey = publicKey;
    }

    public void checkAccess(LicenseCheckerCallback callback) {
        mCallback = callback;
        Intent serviceIntent = new Intent("com.android.vending.licensing.ILicensingService.BIND");
        serviceIntent.setPackage("com.android.vending");
        boolean bound = mContext.bindService(serviceIntent, mServiceConnection, Context.BIND_AUTO_CREATE);
        if (!bound) {
            mCallback.applicationError(Policy.RETRY);
        }
    }

    private final ServiceConnection mServiceConnection = new ServiceConnection() {
        public void onServiceConnected(ComponentName name, IBinder service) {
            mService = ILicensingService.Stub.asInterface(service);
            try {
                long nonce = System.currentTimeMillis();
                mService.checkLicense(nonce, mContext.getPackageName(), new ResultListener());
            } catch (RemoteException e) {
                mCallback.applicationError(Policy.RETRY);
            }
        }

        public void onServiceDisconnected(ComponentName name) {
            mService = null;
        }
    };

    private class ResultListener extends ILicenseResultListener.Stub {
        public void verifyLicense(int responseCode, String signedData, String signature) {
            if (responseCode == 0) {
                mCallback.allow(responseCode);
            } else {
                mCallback.doNotAllow(responseCode);
            }
            mContext.unbindService(mServiceConnection);
        }
    }

    public void onDestroy() {
        try {
            mContext.unbindService(mServiceConnection);
        } catch (Exception ignored) {}
    }
}
