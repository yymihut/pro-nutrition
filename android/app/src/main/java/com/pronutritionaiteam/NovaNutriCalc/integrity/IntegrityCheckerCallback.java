package com.pronutritionaiteam.NovaNutriCalc.integrity;

public interface IntegrityCheckerCallback {
    // Apelat în caz de succes, furnizând token-ul primit
    void onIntegritySuccess(String token);
    
    // Apelat în caz de eșec, furnizând detalii despre excepție
    void onIntegrityFailure(Exception e);
}
