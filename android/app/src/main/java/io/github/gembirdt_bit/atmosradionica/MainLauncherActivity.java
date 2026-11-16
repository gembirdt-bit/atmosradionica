package io.github.gembirdt_bit.atmosradionica;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;

import com.google.androidbrowserhelper.trusted.LauncherActivity;

/**
 * Pokretač aplikacije. Na Androidu 13+ PRE otvaranja sajta sam traži dozvolu
 * za obaveštenja (standardni Android prozor), pa tek onda otvara aplikaciju.
 * Chrome pri otvaranju pročita da je dozvola data i obaveštenja odmah rade —
 * ne zavisi od Chrome-ovog posrednog traženja dozvole (koje ne radi pouzdano
 * kad više Atmos aplikacija deli isti sajt gembirdt-bit.github.io).
 * Ako korisnik dvaput odbije, Android više ne prikazuje prozor i aplikacija se
 * otvara odmah, bez čekanja.
 */
public class MainLauncherActivity extends LauncherActivity {
    private static final int REQ_NOTIF = 7301;
    private boolean waitingForPermission;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        waitingForPermission = Build.VERSION.SDK_INT >= 33
                && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED;
        super.onCreate(savedInstanceState);
        if (waitingForPermission && !isFinishing()) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIF);
        }
    }

    @Override
    protected boolean shouldLaunchImmediately() {
        return !waitingForPermission && super.shouldLaunchImmediately();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_NOTIF && waitingForPermission) {
            waitingForPermission = false;
            launchTwa();
        }
    }
}
