package com.sonora.music;

import android.os.Build;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Allow WebView media autoplay without user gesture requirement
        try {
            WebView webView = this.getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setMediaPlaybackRequiresUserGesture(false);
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Android 13+ Runtime Notification Permission Request
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            ActivityCompat.requestPermissions(
                this,
                new String[]{android.Manifest.permission.POST_NOTIFICATIONS},
                101
            );
        }
    }
}
