package com.pronutritionaiteam.NovaNutriCalc.licensing;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.util.Log;
import com.google.android.vending.licensing.LicenseCheckerCallback;

public class MyLicenseCheckerCallback implements LicenseCheckerCallback {

    private static final String TAG = "LicenseCallback";
    private Context context;

    public MyLicenseCheckerCallback(Context context) {
        this.context = context;
    }

    @Override
    public void allow(int reason) {
        Log.d(TAG, "License granted! Reason: " + reason);
        // Licența este validă, aplicația poate continua normal
    }

    @Override
    public void doNotAllow(int reason) {
        Log.w(TAG, "License denied. Reason: " + reason);
        if (context instanceof Activity) {
            final Activity activity = (Activity) context;
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    new AlertDialog.Builder(activity)
                        .setTitle("Licență Invalida")
                        .setMessage("Această copie a aplicației nu este licențiată. Aplicația se va închide.")
                        .setCancelable(false)
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                activity.finish();
                            }
                        })
                        .show();
                }
            });
        }
    }

    @Override
    public void applicationError(int errorCode) {
        Log.e(TAG, "License check error. Code: " + errorCode);
        if (context instanceof Activity) {
            final Activity activity = (Activity) context;
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    new AlertDialog.Builder(activity)
                        .setTitle("Eroare Licență")
                        .setMessage("A apărut o eroare la verificarea licenței. Aplicația se va închide.")
                        .setCancelable(false)
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                activity.finish();
                            }
                        })
                        .show();
                }
            });
        }
    }
}
