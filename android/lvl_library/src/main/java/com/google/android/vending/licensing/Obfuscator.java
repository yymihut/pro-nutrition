package com.google.android.vending.licensing;

public interface Obfuscator {
    String obfuscate(String original, String key);
    String unobfuscate(String obfuscated, String key);
}