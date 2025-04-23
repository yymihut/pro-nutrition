// MainActivity.java
package com.pronutritionaiteam.NovaNutriCalc;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // No changes needed here; App Open Ads handled in Application class
        registerPlugin(com.pronutritionaiteam.removeads.RemoveAdsPlugin.class);
    }
}