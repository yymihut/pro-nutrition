package com.google.android.vending.licensing;

public class ResponseData {
    public final int responseCode;
    public final String signedData;
    public final String signature;

    public ResponseData(int responseCode, String signedData, String signature) {
        this.responseCode = responseCode;
        this.signedData = signedData;
        this.signature = signature;
    }
}