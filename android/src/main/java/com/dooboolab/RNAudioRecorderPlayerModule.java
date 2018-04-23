
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

  private final ReactApplicationContext reactContext;
  private MediaRecorder mediaRecorder;
  private MediaPlayer mediaPlayer;

  private TimerTask mTask;
  private Timer mTimer;

  public RNAudioRecorderPlayerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return TAG;
  }

  @ReactMethod
  public void startRecord(String path, Promise promise) {
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
      mediaRecorder.setOnInfoListener(new MediaRecorder.OnInfoListener() {
        @Override
        public void onInfo(MediaRecorder mr, int what, int extra) {
          switch (what) {
            case MediaRecorder.MEDIA_RECORDER_INFO_UNKNOWN:
              Log.d(TAG, "MEDIA_RECORDER_INFO_UNKNOWN: " + extra);
              break;
            case MediaRecorder.MEDIA_RECORDER_INFO_MAX_DURATION_REACHED:
              Log.d(TAG, "MEDIA_RECORDER_INFO_MAX_DURATION_REACHED: " + extra);
              break;
            case MediaRecorder.MEDIA_RECORDER_INFO_MAX_FILESIZE_REACHED:
              Log.d(TAG, "MEDIA_RECORDER_INFO_MAX_FILESIZE_REACHED: " + extra);
              break;
          }
        }
      });

      promise.resolve("recorder started.");
    } catch (Exception e) {
      Log.e(TAG, "Exception: ", e);
      promise.reject("startRecord", e.getMessage());
    }
  }

  @ReactMethod
  public void stopRecord(Promise promise) {
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
  public void startPlay(String path, Promise promise) {
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
    }
    mediaPlayer = new MediaPlayer();
    try {
      if (path.equals("DEFAULT")) {
        mediaPlayer.setDataSource(FILE_LOCATION);
      } else {
        mediaPlayer.setDataSource(path);
      }
      mediaPlayer.prepare();
      mediaPlayer.start();

      /**
       * Set timer task to send event to RN.
       */
      mTask = new TimerTask() {
        @Override
        public void run() {
          WritableMap obj = Arguments.createMap();
          obj.putInt("duration", mediaPlayer.getDuration());
          obj.putInt("current_position", mediaPlayer.getCurrentPosition());
          sendEvent(reactContext, "rn-playback", obj);
        }
      };

      mTimer = new Timer();
      mTimer.schedule(mTask, 0, 100);

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
          obj.putInt("duration", mediaPlayer.getDuration());
          obj.putInt("current_position", mediaPlayer.getDuration());
          sendEvent(reactContext, "rn-playback", obj);

          /**
           * Reset player.
           */
          Log.d(TAG, "Plays completed.");
          mTimer.cancel();
          mp.stop();
          mp.release();
          mp = null;
        }
      });

      promise.resolve("player started.");
    } catch (IOException e) {
      Log.e(TAG, "startPlay() failed");
      promise.reject("startPlay", e.getMessage());
    }

    mediaPlayer.setOnBufferingUpdateListener(new MediaPlayer.OnBufferingUpdateListener() {
      @Override
      public void onBufferingUpdate(MediaPlayer mp, int percent) {
        Log.d(TAG, "percent: " + percent);
      }
    });
  }

  @ReactMethod
  public void pausePlay(Promise promise) {
    if (mediaPlayer == null) {
      promise.reject("pausePlay","mediaPlayer is null.");
      return;
    }

    mediaPlayer.pause();
    promise.resolve("pause player");
  }

  @ReactMethod
  public void seekTo(int time, Promise promise) {
    if (mediaPlayer == null) {
      promise.reject("seekTo","mediaPlayer is null.");
      return;
    }

    mediaPlayer.seekTo(time);
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
  public void stopPlay(Promise promise) {
    if (mediaPlayer == null) {
      promise.reject("stopPlay","mediaPlayer is null.");
      return;
    }

    if (mTimer != null) {
      mTimer.cancel();
    }

    mediaPlayer.release();
    mediaPlayer = null;
    promise.resolve("stopped player");
  }
}
