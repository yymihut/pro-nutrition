package com.pronutritionaiteam.NovaNutriCalc;

import android.os.Bundle;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import com.pronutritionaiteam.NovaNutriCalc.integrity.IntegrityCheckerUtil;
import com.pronutritionaiteam.NovaNutriCalc.integrity.IntegrityCheckerCallback;

import org.json.JSONObject;

import java.io.IOException;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class MainActivity extends BridgeActivity {

    private IntegrityCheckerUtil integrityCheckerUtil;
    // URL-ul endpoint-ului backend
    private static final String BACKEND_URL = "https://verifyintegritytoken-jki3iqjjdq-ew.a.run.app";


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
    // Trimiterea tokenului către backend pentru validare
    sendTokenToBackend(token);
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
    // Metodă pentru trimiterea token-ului către backend
    private void sendTokenToBackend(String token) {
        // Executăm request-ul într-un nou thread pentru a nu bloca UI-ul
        new Thread(() -> {
            OkHttpClient client = new OkHttpClient();
            MediaType JSON = MediaType.parse("application/json; charset=utf-8");
            try {
                // Construim corpul cererii JSON
                JSONObject json = new JSONObject();
                json.put("token", token);
                RequestBody body = RequestBody.create(json.toString(), JSON);

                Request request = new Request.Builder()
                        .url(BACKEND_URL)
                        .post(body)
                        .build();

                Response response = client.newCall(request).execute();
                if (response.isSuccessful()) {
                    String responseBody = response.body().string();
                    Log.d("Integrity", "Backend response: " + responseBody);
                    // Aici poți să interpretezi payload-ul și să decizi ce trebuie să faci (de exemplu, notificarea utilizatorului că licența este validă)
                } else {
                    Log.e("Integrity", "Backend call failed: " + response.code());
                }
            } catch (Exception e) {
                Log.e("Integrity", "Exception when sending token to backend", e);
            }
        }).start();
    }
}
