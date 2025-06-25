package com.dooboolab.audiorecorderplayer

import android.Manifest
import android.content.pm.PackageManager
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.util.Log
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.facebook.react.modules.core.PermissionListener
import java.io.IOException
import java.util.*
import kotlin.math.log10

class RNAudioRecorderPlayerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), PermissionListener, LifecycleEventListener {
    private var audioFileURL = ""
    private var subsDurationMillis = 500
    private var _meteringEnabled = false
    private var mediaRecorder: MediaRecorder? = null
    private var mediaPlayer: MediaPlayer? = null
    private var recorderRunnable: Runnable? = null
    private var mTask: TimerTask? = null
    private var mTimer: Timer? = null
    private var pausedRecordTime = 0L
    private var totalPausedRecordTime = 0L
    var recordHandler: Handler? = Handler(Looper.getMainLooper())
    override fun getName(): String {
        return tag
    }

    @ReactMethod
    fun startRecorder(path: String, audioSet: ReadableMap?, meteringEnabled: Boolean, promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                // On devices that run Android 10 (API level 29) or higher
                // your app can contribute to well-defined media collections such as MediaStore.Downloads without requesting any storage-related permissions
                // https://developer.android.com/about/versions/11/privacy/storage#permissions-target-11
                if (Build.VERSION.SDK_INT < 29 &&
                        (ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED ||
                        ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED))  {
                    ActivityCompat.requestPermissions((currentActivity)!!, arrayOf(
                            Manifest.permission.RECORD_AUDIO,
                            Manifest.permission.WRITE_EXTERNAL_STORAGE), 0)
                    promise.reject("No permission granted.", "Try again after adding permission.")
                    return
                } else if (ActivityCompat.checkSelfPermission(reactContext, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions((currentActivity)!!, arrayOf(Manifest.permission.RECORD_AUDIO), 0)
                    promise.reject("No permission granted.", "Try again after adding permission.")
                    return
                }
            }
        } catch (ne: NullPointerException) {
            Log.w(tag, ne.toString())
            promise.reject("No permission granted.", "Try again after adding permission.")
            return
        }

        var outputFormat = if (audioSet != null && audioSet.hasKey("OutputFormatAndroid"))
            audioSet.getInt("OutputFormatAndroid")
        else
            MediaRecorder.OutputFormat.MPEG_4

        audioFileURL = if (((path == "DEFAULT"))) "${reactContext.cacheDir}/sound.${defaultFileExtensions.get(outputFormat)}" else path
        _meteringEnabled = meteringEnabled

        if (mediaRecorder != null) {
            promise.reject("InvalidState", "startRecorder has already been called.")
            return
        }

        var newMediaRecorder: MediaRecorder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            MediaRecorder(reactContext)
        } else {
            MediaRecorder()
        }

        try {
            if (audioSet == null) {
                newMediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC)
                newMediaRecorder.setOutputFormat(outputFormat)
                newMediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
            } else {
                newMediaRecorder.setAudioSource(if (audioSet.hasKey("AudioSourceAndroid")) audioSet.getInt("AudioSourceAndroid") else MediaRecorder.AudioSource.MIC)
                newMediaRecorder.setOutputFormat(outputFormat)
                newMediaRecorder.setAudioEncoder(if (audioSet.hasKey("AudioEncoderAndroid")) audioSet.getInt("AudioEncoderAndroid") else MediaRecorder.AudioEncoder.AAC)

                if (audioSet.hasKey("AudioSamplingRateAndroid")) {
                    newMediaRecorder.setAudioSamplingRate(audioSet.getInt("AudioSamplingRateAndroid"))
                }

                if (audioSet.hasKey("AudioEncodingBitRateAndroid")) {
                    newMediaRecorder.setAudioEncodingBitRate(audioSet.getInt("AudioEncodingBitRateAndroid"))
                }

                if (audioSet.hasKey("AudioChannelsAndroid")) {
                    newMediaRecorder.setAudioChannels(audioSet.getInt("AudioChannelsAndroid"))
                }
            }
            newMediaRecorder.setOutputFile(audioFileURL)

            newMediaRecorder.prepare()
            totalPausedRecordTime = 0L
            newMediaRecorder.start()

            mediaRecorder = newMediaRecorder

            val systemTime = SystemClock.elapsedRealtime()
            recorderRunnable = object : Runnable {
                override fun run() {
                    val time = SystemClock.elapsedRealtime() - systemTime - totalPausedRecordTime
                    val obj = Arguments.createMap()
                    obj.putDouble("currentPosition", time.toDouble())
                    if (_meteringEnabled) {
                        var maxAmplitude = 0
                        if (mediaRecorder != null) {
                            maxAmplitude = mediaRecorder!!.maxAmplitude
                        }
                        var dB = -160.0
                        val maxAudioSize = 32767.0
                        if (maxAmplitude > 0) {
                            dB = 20 * log10(maxAmplitude / maxAudioSize)
                        }
                        obj.putInt("currentMetering", dB.toInt())
                    }
                    sendEvent(reactContext, "rn-recordback", obj)
                    recordHandler!!.postDelayed(this, subsDurationMillis.toLong())
                }
            }
            (recorderRunnable as Runnable).run()
            promise.resolve("file:///$audioFileURL")
        } catch (e: Exception) {
            newMediaRecorder.release()
            mediaRecorder = null

            Log.e(tag, "Exception: ", e)
            promise.reject("startRecord", e.message)
        }
    }

    @ReactMethod
    fun resumeRecorder(promise: Promise) {
        if (mediaRecorder == null) {
            promise.reject("resumeRecorder", "Recorder is null.")
            return
        }

        try {
            mediaRecorder!!.resume()
            totalPausedRecordTime += SystemClock.elapsedRealtime() - pausedRecordTime;
            recorderRunnable?.let { recordHandler!!.postDelayed(it, subsDurationMillis.toLong()) }
            promise.resolve("Recorder resumed.")
        } catch (e: Exception) {
            Log.e(tag, "Recorder resume: " + e.message)
            promise.reject("resumeRecorder", e.message)
        }
    }

    @ReactMethod
    fun pauseRecorder(promise: Promise) {
        if (mediaRecorder == null) {
            promise.reject("pauseRecorder", "Recorder is null.")
            return
        }

        try {
            mediaRecorder!!.pause()
            pausedRecordTime = SystemClock.elapsedRealtime();
            recorderRunnable?.let { recordHandler!!.removeCallbacks(it) };
            promise.resolve("Recorder paused.")
        } catch (e: Exception) {
            Log.e(tag, "pauseRecorder exception: " + e.message)
            promise.reject("pauseRecorder", e.message)
        }
    }

    @ReactMethod
    fun stopRecorder(promise: Promise) {
        if (recordHandler != null) {
            recorderRunnable?.let { recordHandler!!.removeCallbacks(it) }
        }

        if (mediaRecorder == null) {
            promise.reject("stopRecord", "recorder is null.")
            return
        }

        try {
            mediaRecorder!!.stop()
            mediaRecorder!!.release()
            mediaRecorder = null
            promise.resolve("file:///$audioFileURL")
        } catch (stopException: RuntimeException) {
            stopException.message?.let { Log.d(tag,"" + it) }
            promise.reject("stopRecord", stopException.message)
        }
    }

    @ReactMethod
    fun setVolume(volume: Double, promise: Promise) {
        if (mediaPlayer == null) {
            promise.reject("setVolume", "player is null.")
            return
        }

        val mVolume = volume.toFloat()
        mediaPlayer!!.setVolume(mVolume, mVolume)
        promise.resolve("set volume")
    }

    @ReactMethod
    fun setPlaybackSpeed(playbackSpeed: Float, promise: Promise) {
        if (mediaPlayer == null) {
            promise.reject("setPlaybackSpeed", "player is null.")
            return
        }
        mediaPlayer!!.playbackParams = mediaPlayer!!.playbackParams.setSpeed(playbackSpeed)
        promise.resolve("setPlaybackSpeed")
    }

    @ReactMethod
    fun startPlayer(path: String, httpHeaders: ReadableMap?, promise: Promise) {
        if (mediaPlayer != null) {
            val isPaused = !mediaPlayer!!.isPlaying && mediaPlayer!!.currentPosition > 1

            if (isPaused) {
                mediaPlayer!!.start()
                promise.resolve("player resumed.")
                return
            }

            Log.e(tag, "Player is already running. Stop it first.")
            promise.reject("startPlay", "Player is already running. Stop it first.")
            return
        } else {
            mediaPlayer = MediaPlayer()
        }

        try {
            if ((path == "DEFAULT")) {
                mediaPlayer!!.setDataSource("${reactContext.cacheDir}/$defaultFileName")
            } else {
                if (httpHeaders != null) {
                    val headers: MutableMap<String, String?> = HashMap<String, String?>()
                    val iterator = httpHeaders.keySetIterator()
                    while (iterator.hasNextKey()) {
                        val key = iterator.nextKey()
                        headers.put(key, httpHeaders.getString(key))
                    }
                    mediaPlayer!!.setDataSource(currentActivity!!.applicationContext, Uri.parse(path), headers)
                } else {
                    mediaPlayer!!.setDataSource(path)
                }
            }

            mediaPlayer!!.setOnPreparedListener { mp ->
                Log.d(tag, "Mediaplayer prepared and start")
                mp.start()
                /**
                 * Set timer task to send event to RN.
                 */
                mTask = object : TimerTask() {
                    override fun run() {
                        try {
                            val obj = Arguments.createMap()
                            obj.putInt("duration", mp.duration)
                            obj.putInt("currentPosition", mp.currentPosition)
                            obj.putBoolean("isFinished", false);
                            sendEvent(reactContext, "rn-playback", obj)
                        } catch (e: IllegalStateException) {
                            // IllegalStateException 처리
                            Log.e(tag, "Mediaplayer error: ${e.message}")
                        }
                    }
                }

                mTimer = Timer()
                mTimer!!.schedule(mTask, 0, subsDurationMillis.toLong())
                val resolvedPath = if (((path == "DEFAULT"))) "${reactContext.cacheDir}/$defaultFileName" else path
                promise.resolve(resolvedPath)
            }

            /**
             * Detect when finish playing.
             */
            mediaPlayer!!.setOnCompletionListener { mp ->
                /**
                 * Send last event
                 */
                val obj = Arguments.createMap()
                obj.putInt("duration", mp.duration)
                obj.putInt("currentPosition", mp.currentPosition)
                obj.putBoolean("isFinished", true);
                sendEvent(reactContext, "rn-playback", obj)
                /**
                 * Reset player.
                 */
                Log.d(tag, "Plays completed.")
                mTimer?.cancel()
                mp.stop()
                mp.reset()
                mp.release()
                mediaPlayer = null
            }

            mediaPlayer!!.prepare()
        } catch (e: IOException) {
            Log.e(tag, "startPlay() io exception")
            promise.reject("startPlay", e.message)
        } catch (e: NullPointerException) {
            Log.e(tag, "startPlay() null exception")
        }
    }

    @ReactMethod
    fun resumePlayer(promise: Promise) {
        if (mediaPlayer == null) {
            promise.reject("resume", "Mediaplayer is null on resume.")
            return
        }

        if (mediaPlayer!!.isPlaying) {
            promise.reject("resume", "Mediaplayer is already running.")
            return
        }

        try {
            mediaPlayer!!.seekTo(mediaPlayer!!.currentPosition)
            mediaPlayer!!.start()
            promise.resolve("resume player")
        } catch (e: Exception) {
            Log.e(tag, "Mediaplayer resume: " + e.message)
            promise.reject("resume", e.message)
        }
    }

    @ReactMethod
    fun pausePlayer(promise: Promise) {
        if (mediaPlayer == null) {
            promise.reject("pausePlay", "Mediaplayer is null on pause.")
            return
        }

        try {
            mediaPlayer!!.pause()
            promise.resolve("pause player")
        } catch (e: Exception) {
            Log.e(tag, "pausePlay exception: " + e.message)
            promise.reject("pausePlay", e.message)
        }
    }

    @ReactMethod
    fun seekToPlayer(time: Double, promise: Promise) {
        if (mediaPlayer == null) {
            promise.reject("seekTo", "Mediaplayer is null on seek.")
            return
        }

        mediaPlayer!!.seekTo(time.toInt())
        promise.resolve("pause player")
    }

    private fun sendEvent(reactContext: ReactContext,
                          eventName: String,
                          params: WritableMap?) {
        reactContext
                .getJSModule<RCTDeviceEventEmitter>(RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
    }

    @ReactMethod
    fun stopPlayer(promise: Promise) {
        if (mTimer != null) {
            mTimer!!.cancel()
        }

        if (mediaPlayer == null) {
            promise.resolve("Already stopped player")
            return
        }

        try {
            mediaPlayer!!.stop()
            mediaPlayer!!.reset()
            mediaPlayer!!.release()
            mediaPlayer = null
            promise.resolve("stopped player")
        } catch (e: Exception) {
            Log.e(tag, "stopPlay exception: " + e.message)
            promise.reject("stopPlay", e.message)
        }
    }

    @ReactMethod
    fun setSubscriptionDuration(sec: Double, promise: Promise) {
        subsDurationMillis = (sec * 1000).toInt()
        promise.resolve("setSubscriptionDuration: $subsDurationMillis")
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray): Boolean {
        var requestRecordAudioPermission: Int = 200

        when (requestCode) {
            requestRecordAudioPermission -> if (grantResults[0] == PackageManager.PERMISSION_GRANTED) return true
        }

        return false
    }

    init {
        reactContext.addLifecycleEventListener(this)
    }
    
    override fun onHostDestroy() {
        autoSaveRecordingIfNeeded()
    }

    override fun onHostPause() {}

    override fun onHostResume() {}

    private fun autoSaveRecordingIfNeeded() {
        if (mediaRecorder != null) {
            try {
                mediaRecorder!!.stop()
                mediaRecorder!!.release()
                mediaRecorder = null
                Log.d(tag, "Recording auto-saved on app pause/destroy.")
            } catch (e: Exception) {
                Log.e(tag, "Error auto-saving recording: ${e.message}")
            }
        }
    }

    protected fun finalize() {
        reactContext.removeLifecycleEventListener(this)
    }

    companion object {
        private var tag = "RNAudioRecorderPlayer"
        private var defaultFileName = "sound.mp4"
        private var defaultFileExtensions = listOf(
            "mp4", // DEFAULT = 0
            "3gp", // THREE_GPP
            "mp4", // MPEG_4
            "amr", // AMR_NB
            "amr", // AMR_WB
            "aac", // AAC_ADIF
            "aac", // AAC_ADTS
            "rtp", // OUTPUT_FORMAT_RTP_AVP
            "ts",  // MPEG_2_TSMPEG_2_TS
            "webm",// WEBM
            "xxx", // UNUSED
            "ogg", // OGG
        )
    }
}
