package com.google.android.vending.licensing;

public interface Policy {
    int LICENSED = 0;
    int NOT_LICENSED = 1;
    int RETRY = 2;

    void processServerResponse(int response, com.google.android.vending.licensing.ResponseData rawData);
    boolean allowAccess();
}