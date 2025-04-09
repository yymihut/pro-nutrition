package com.pronutritionaiteam.NovaNutriCalc.integrity;

import android.content.Context;
import android.util.Base64;
import android.util.Log;

import com.google.android.play.core.integrity.IntegrityManager;
import com.google.android.play.core.integrity.IntegrityManagerFactory;
import com.google.android.play.core.integrity.IntegrityTokenRequest;
import com.google.android.play.core.integrity.IntegrityTokenResponse;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.Task;

import java.security.SecureRandom;

public class IntegrityCheckerUtil {

    private IntegrityManager integrityManager;
    private Context context;

    public IntegrityCheckerUtil(Context context, IntegrityCheckerCallback callback) {
        this.context = context;
        integrityManager = IntegrityManagerFactory.create(context);

        // Generăm un nonce folosind un array de octeți și codificare base64 (URL_SAFE, NO_WRAP)
        String nonce = generateNonce();

        IntegrityTokenRequest request = IntegrityTokenRequest.builder()
                .setNonce(nonce)
                .build();

        Task<IntegrityTokenResponse> tokenTask = integrityManager.requestIntegrityToken(request);

        tokenTask.addOnSuccessListener(new OnSuccessListener<IntegrityTokenResponse>() {
            @Override
            public void onSuccess(IntegrityTokenResponse integrityTokenResponse) {
                String token = integrityTokenResponse.token();
                callback.onIntegritySuccess(token);
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                Log.e("Integrity", "Cererea pentru token a eșuat", e);
                callback.onIntegrityFailure(e);
            }
        });
    }

    // Metodă de generare a unui nonce corect codificat
    private String generateNonce() {
        byte[] nonceBytes = new byte[32];  // Poți ajusta lungimea după necesități
        new SecureRandom().nextBytes(nonceBytes);
        return Base64.encodeToString(nonceBytes, Base64.URL_SAFE | Base64.NO_WRAP);
    }

    // Cleanup (dacă este necesar)
    public void destroy() {
        // Play Integrity API nu oferă o metodă explicită de distrugere
    }
}
