package com.dooboo;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class RNAudioRecorderPlayerModule extends ReactContextBaseJavaModule {
  final String TAG = "RNAudioRecorderModule";

  private final ReactApplicationContext reactContext;

  public RNAudioRecorderPlayerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return TAG;
  }
}
