package com.dooboo;

import android.Manifest;
import android.content.pm.PackageManager;
import androidx.annotation.NonNull;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
      return "dooboo";
  }

  // Requesting permission to RECORD_AUDIO
  private static final int REQUEST_RECORD_AUDIO_PERMISSION = 200;
  private boolean permissionToRecordAccepted = false;
  private String [] permissions = {Manifest.permission.RECORD_AUDIO, Manifest.permission.WRITE_EXTERNAL_STORAGE};

  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    switch (requestCode){
      case REQUEST_RECORD_AUDIO_PERMISSION:
        permissionToRecordAccepted  = grantResults[0] == PackageManager.PERMISSION_GRANTED;
        break;
    }
    if (!permissionToRecordAccepted ) finish();

  }
}
