
package com.dooboolab;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

import javax.annotation.Nullable;

public class RNAudioRecorderPlayerModule extends ReactContextBaseJavaModule {
  final private static String TAG = "RNAudioRecorderPlayer";
  final private static String FILE_LOCATION = "/sdcard/sound.mp4";

  private subsDurationMillis = 10;

  private final ReactApplicationContext reactContext;
  private MediaRecorder mediaRecorder;
  private MediaPlayer mediaPlayer;

  private Runnable recorderRunnable;
  private TimerTask mTask;
  private Timer mTimer;
  final private Handler recordHandler = new Handler();

  public RNAudioRecorderPlayerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return TAG;
  }

  @ReactMethod
  public void startRecorder(final String path, Promise promise) {
    if (mediaRecorder == null) {
      mediaRecorder = new MediaRecorder();
      mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
      mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
      mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.DEFAULT);
      if (path.equals("DEFAULT")) {
        mediaRecorder.setOutputFile(FILE_LOCATION);
      } else {
        mediaRecorder.setOutputFile(path);
      }
    }

    try {
      mediaRecorder.prepare();
      mediaRecorder.start();
      final long systemTime = SystemClock.elapsedRealtime();
      this.recorderRunnable = new Runnable() {
        @Override
        public void run() {
          long time = SystemClock.elapsedRealtime() - systemTime;
          try {
            WritableMap obj = Arguments.createMap();
            obj.putInt("current_position", mp.getDuration());
            sendEvent(reactContext, "rn-recordback", obj);
            recordHandler.postDelayed(this.recorderRunnable, model.subsDurationMillis);
          } catch (JSONException je) {
            Log.d(TAG, "Json Exception: " + je.toString());
          }
        }
      };
      this.recorderRunnable.run();

      String resolvedPath = (path.equals("DEFAULT")) ? FILE_LOCATION : path;
      promise.resolve("file://" + resolvedPath);
    } catch (Exception e) {
      Log.e(TAG, "Exception: ", e);
      promise.reject("startRecord", e.getMessage());
    }
  }

  @ReactMethod
  public void stopRecorder(Promise promise) {
    recorderRunnable.removeCallbacks(this.recorderRunnable);
    if (mediaRecorder == null) {
      promise.reject("stopRecord", "recorder is null.");
      return;
    }
    mediaRecorder.stop();
    mediaRecorder.release();
    mediaRecorder = null;

    promise.resolve("recorder stopped.");
  }

  @ReactMethod
  public void startPlayer(final String path, final Promise promise) {
    if (mediaPlayer != null) {
      Boolean isPaused = !mediaPlayer.isPlaying() && mediaPlayer.getCurrentPosition() > 1;

      if (isPaused) {
        mediaPlayer.start();
        promise.resolve("player resumed.");
        return;
      }

      Log.e(TAG, "Player is already running. Stop it first.");
      promise.reject("startPlay", "Player is already running. Stop it first.");
      return;
    } else {
      mediaPlayer = new MediaPlayer();
    }
    try {
      if (path.equals("DEFAULT")) {
        mediaPlayer.setDataSource(FILE_LOCATION);
      } else {
        mediaPlayer.setDataSource(path);
      }
      mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
        @Override
        public void onPrepared(final MediaPlayer mp) {
          Log.d(TAG, "mediaplayer prepared and start");
          mp.start();

          /**
           * Set timer task to send event to RN.
           */
          mTask = new TimerTask() {
            @Override
            public void run() {
              WritableMap obj = Arguments.createMap();
              obj.putInt("duration", mp.getDuration());
              obj.putInt("current_position", mp.getCurrentPosition());
              sendEvent(reactContext, "rn-playback", obj);
            }
          };

          mTimer = new Timer();
          mTimer.schedule(mTask, 0, 1000);

          String resolvedPath = (path.equals("DEFAULT")) ? "file://" + FILE_LOCATION : path;
          promise.resolve(resolvedPath);
        }
      });
      /**
       * Detect when finish playing.
       */
      mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
        @Override
        public void onCompletion(MediaPlayer mp) {
          /**
           * Send last event
           */
          WritableMap obj = Arguments.createMap();
          obj.putInt("duration", mp.getDuration());
          obj.putInt("current_position", mp.getDuration());
          sendEvent(reactContext, "rn-playback", obj);

          /**
           * Reset player.
           */
          Log.d(TAG, "Plays completed.");
          mTimer.cancel();
          mp.stop();
          mp.release();
          mediaPlayer = null;
        }
      });
      mediaPlayer.prepare();
    } catch (IOException e) {
      Log.e(TAG, "startPlay() io exception");
      promise.reject("startPlay", e.getMessage());
    } catch (NullPointerException e) {
      Log.e(TAG, "startPlay() null exception");
    }
  }

  @ReactMethod
  public void resumePlayer(Promise promise) {
    if (mediaPlayer == null) {
      promise.reject("resume","mediaPlayer is null.");
      return;
    }

    if (mediaPlayer.isPlaying()) {
      promise.reject("resume","mediaPlayer is already running.");
      return;
    }

    try {
      mediaPlayer.seekTo(mediaPlayer.getCurrentPosition());
      mediaPlayer.start();
      promise.resolve("resume player");
    } catch (Exception e) {
      Log.e(TAG, "mediaPlayer resume: " + e.getMessage());
      promise.reject("resume", e.getMessage());
    }

  }

  @ReactMethod
  public void pausePlayer(Promise promise) {
    if (mediaPlayer == null) {
      promise.reject("pausePlay","mediaPlayer is null.");
      return;
    }

    try {
      mediaPlayer.pause();
      promise.resolve("pause player");
    } catch (Exception e) {
      Log.e(TAG, "pausePlay exception: " + e.getMessage());
      promise.reject("pausePlay",e.getMessage());
    }
  }

  @ReactMethod
  public void seekToPlayer(int time, Promise promise) {
    if (mediaPlayer == null) {
      promise.reject("seekTo","mediaPlayer is null.");
      return;
    }

    int millis = time * 1000;

    mediaPlayer.seekTo(millis);
    promise.resolve("pause player");
  }

  private void sendEvent(ReactContext reactContext,
                         String eventName,
                         @Nullable WritableMap params) {
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }

  @ReactMethod
  public void stopPlayer(Promise promise) {
    if (mTimer != null) {
      mTimer.cancel();
    }

    if (mediaPlayer == null) {
      promise.reject("stopPlay","mediaPlayer is null.");
      return;
    }

    try {
      mediaPlayer.release();
      mediaPlayer = null;
      promise.resolve("stopped player");
    } catch (Exception e) {
      Log.e(TAG, "stopPlay exception: " + e.getMessage());
      promise.reject("stopPlay",e.getMessage());
    }
  }

  @ReactMethod
  public void setSubscriptionDuration(double sec, Promise promise) {
    this.subsDurationMillis = (int) (sec * 1000);
    promise.resolve("setSubscriptionDuration: " + this.subsDurationMillis);
  }
}
