package com.google.android.vending.licensing;

public class AESObfuscator implements Obfuscator {
    public AESObfuscator(byte[] salt, String packageName, String deviceId) {
    }

    @Override
    public String obfuscate(String original, String key) {
        return original;
    }

    @Override
    public String unobfuscate(String obfuscated, String key) {
        return obfuscated;
    }
}