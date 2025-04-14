package com.pronutritionaiteam.NovaNutriCalc;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

// IMPORTANT: asigură-te că importul este corect pentru plugin
import com.mycompany.capacitor.play.integrity.CapacitorPlayIntegrityPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Înregistrează pluginul PlayIntegrity
    registerPlugin(CapacitorPlayIntegrityPlugin.class);
  }
}
