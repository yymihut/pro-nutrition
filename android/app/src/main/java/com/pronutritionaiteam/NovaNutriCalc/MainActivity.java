package com.pronutritionaiteam.NovaNutriCalc;

import android.os.Bundle;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import com.pronutritionaiteam.NovaNutriCalc.integrity.IntegrityCheckerUtil;
import com.pronutritionaiteam.NovaNutriCalc.integrity.IntegrityCheckerCallback;

public class MainActivity extends BridgeActivity {

    private IntegrityCheckerUtil integrityCheckerUtil;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Important: apelul către super.onCreate trebuie efectuat pentru a inițializa corect Capacitor
        super.onCreate(savedInstanceState);

        // Inițiază apelul către Play Integrity API
        requestIntegrityToken();
    }

    private void requestIntegrityToken() {
        integrityCheckerUtil = new IntegrityCheckerUtil(this, new IntegrityCheckerCallback() {
            @Override
            public void onIntegritySuccess(String token) {
                Log.d("Integrity", "Token Received: " + token);
                // Poți prelucra token-ul (de ex. trimiterea pe server pentru validare)
            }

            @Override
            public void onIntegrityFailure(Exception e) {
                Log.e("Integrity", "Error requesting integrity token", e);
                showErrorAndClose("Integrity check failed. The application will close.");
            }
        });
    }

    private void showErrorAndClose(String message) {
        runOnUiThread(() -> {
            new AlertDialog.Builder(MainActivity.this)
                .setTitle("Integrity error")
                .setMessage(message)
                .setCancelable(false)
                .setPositiveButton("OK", (dialog, which) -> finish())
                .show();
        });
    }
}
