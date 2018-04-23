
import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  Platform,
} from 'react-native';

const { RNAudioRecorderPlayer } = NativeModules;

class AudioRecorderPlayer {
  static _isRecording;
  static _isPlaying;
  static _subscription;
  static _recordInterval;

  mmss = (secs) => {
    let minutes = Math.floor(secs / 60);
    secs = secs % 60;
    minutes = minutes % 60;
    minutes = ('0' + minutes).slice(-2);
    secs = ('0' + secs).slice(-2);
    return minutes + ':' + secs;
  }

  /**
   * setInterval for recording by 1 sec.
   * @returns {callBack}
   */
  setRecordInterval = (callBack) => {
    _recordInterval = setInterval(callBack, 1000);
  }

  /**
   * clearInterval for recording.
   */
  removeRecordInterval = (callBack) => {
    clearInterval(_recordInterval);
  }

  /**
   * set listerner from native module for player.
   * @returns {callBack(e: Event)}
   */
  addPlayBackListener = (e: Event) => {
    if (Platform.OS === 'android') {
      this._subscription = DeviceEventEmitter.addListener('rn-playback', e);
    } else {
      const myModuleEvt = new NativeEventEmitter(RNAudioRecorderPlayer);
      this._subscription = myModuleEvt.addListener('rn-playback', e);
    }
  }

  /**
   * remove listener for player.
   * @returns {Promise<void>}
   */
  removePlayBackListener = () => {
    if (this._subscription) {
      this._subscription.remove();
    }
  }

  /**
   * start recording.
   * @returns {Promise<string>}
   */
  startRecord = async() => {
    if (!this._isRecording) {
      this._isRecording = true;
      return await RNAudioRecorderPlayer.startRecord('DEFAULT');
    }
    console.log('Already recording');
  }

  /**
   * start recording with param.
   * @param {string} uri audio uri.
   * @returns {Promise<string>}
   */
  startRecord = async(uri) => {
    if (!this._isRecording) {
      this._isRecording = true;
      return await RNAudioRecorderPlayer.startRecord(uri);
    }
    console.log('Already recording');
  }

  /**
   * stop recording.
   * @returns {Promise<string>}
   */
  stopRecord = async() => {
    if (this._isRecording) {
      this._isRecording = false;
      return await RNAudioRecorderPlayer.stopRecord();
    }
    console.log('Already stopped recording');
  }

  /**
   * start playing.
   * @returns {Promise<string>}
   */
  startPlay = async () => {
    if (!this._isPlaying) {
      this._isPlaying = true;
      return await RNAudioRecorderPlayer.startPlay('DEFAULT');
    }
    console.log('Already started playing');
  }

  /**
   * start playing with param.
   * @param {string} uri audio uri.
   * @returns {Promise<string>}
   */
  startPlay = async (uri) => {
    if (!this._isPlaying) {
      this._isPlaying = true;
      return await RNAudioRecorderPlayer.startPlay(uri);
    }
    console.log('Already started playing');
  }

  /**
   * stop playing.
   * @returns {Promise<string>}
   */
  stopPlay = async () => {
    if (this._isPlaying) {
      this._isPlaying = false;
      return await RNAudioRecorderPlayer.stopPlay();
    }
    console.log('Already stopped playing');
  }

  /**
   * pause playing.
   * @returns {Promise<string>}
   */
  pausePlay = async () => {
    if (this._isPlaying) {
      this._isPlaying = false;
      return await RNAudioRecorderPlayer.pausePlay();
    }
    console.log('Already paused or stopped');
  }

  /**
   * seek to.
   * @param {string} time changed position for play time in seconds.
   * @returns {Promise<string>}
   */
  seekTo = async (time) => {
    return await RNAudioRecorderPlayer.seekTo(time);
  }
}

export default AudioRecorderPlayer;

