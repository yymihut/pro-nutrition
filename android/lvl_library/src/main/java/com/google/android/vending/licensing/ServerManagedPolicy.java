package com.google.android.vending.licensing;

import android.content.Context;

public class ServerManagedPolicy implements Policy {
    public ServerManagedPolicy(Context context, Obfuscator obfuscator) {
    }

    @Override
    public void processServerResponse(int response, ResponseData rawData) {
    }

    @Override
    public boolean allowAccess() {
        return true;
    }
}