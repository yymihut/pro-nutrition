package com.pronutritionaiteam.NovaNutriCalc;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.pronutritionaiteam.NovaNutriCalc.licensing.LicenseCheckerUtil;
import com.pronutritionaiteam.NovaNutriCalc.licensing.MyLicenseCheckerCallback;


public class MainActivity extends BridgeActivity {
    private LicenseCheckerUtil licenseCheckerUtil;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Inițiem verificarea licenței la pornirea aplicației
        
        licenseCheckerUtil = new LicenseCheckerUtil(this, new MyLicenseCheckerCallback(this));
        
    }

 @Override
    public void onDestroy() {
        if (licenseCheckerUtil != null) {
            licenseCheckerUtil.destroy();
        }
        super.onDestroy();
    }

}