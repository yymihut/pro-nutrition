// MainActivity.java
package com.pronutritionaiteam.NovaNutriCalc;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.PopupMenu;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;

public class MainActivity extends BridgeActivity {

    private GoogleMobileAdsConsentManager googleMobileAdsConsentManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        googleMobileAdsConsentManager = GoogleMobileAdsConsentManager.getInstance(getApplicationContext());

        OnBackPressedCallback callback = new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (getBridge().getWebView().canGoBack()) {
                    getBridge().getWebView().goBack();
                } else {
                    finish();
                }
            }
        };
        getOnBackPressedDispatcher().addCallback(this, callback);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.action_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        View menuItemView = findViewById(item.getItemId());
        PopupMenu popup = new PopupMenu(this, menuItemView);
        popup.getMenuInflater().inflate(R.menu.popup_menu, popup.getMenu());
        popup.getMenu().findItem(R.id.privacy_settings)
                .setVisible(googleMobileAdsConsentManager.isPrivacyOptionsRequired());
        popup.show();
        popup.setOnMenuItemClickListener(menuItem -> {
            if (menuItem.getItemId() == R.id.privacy_settings) {
                googleMobileAdsConsentManager.showPrivacyOptionsForm(
                        this,
                        error -> {
                            if (error != null) {
                                Toast.makeText(this, error.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        }
                );
                return true;
            } else if (menuItem.getItemId() == R.id.ad_inspector) {
                MobileAds.openAdInspector(
                        this,
                        error -> {
                            if (error != null) {
                                Toast.makeText(this, error.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        }
                );
                return true;
            }
            return false;
        });
        return super.onOptionsItemSelected(item);
    }
}
