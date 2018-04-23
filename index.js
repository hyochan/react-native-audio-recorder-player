
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

  setRecordInterval = (callBack) => {
    _recordInterval = setInterval(callBack, 1000);
  }

  removeRecordInterval = (callBack) => {
    clearInterval(_recordInterval);
  }

  addPlayBackListener = (e: Event) => {
    if (Platform.OS === 'android') {
      this._subscription = DeviceEventEmitter.addListener('rn-playback', e);
    } else {
      const myModuleEvt = new NativeEventEmitter(RNAudioRecorderPlayer);
      this._subscription = myModuleEvt.addListener('rn-playback', e);
    }
  }

  removePlayBackListener = () => {
    if (this._subscription) {
      this._subscription.remove();
    }
  }

  startRecord = async() => {
    if (!this._isRecording) {
      this._isRecording = true;
      return await RNAudioRecorderPlayer.startRecord('DEFAULT');
    }
    console.log('Already recording');
  }

  stopRecord = async() => {
    if (this._isRecording) {
      this._isRecording = false;
      return await RNAudioRecorderPlayer.stopRecord();
    }
    console.log('Already stopped recording');
  }

  startPlay = async () => {
    if (!this._isPlaying) {
      this._isPlaying = true;
      return await RNAudioRecorderPlayer.startPlay('DEFAULT');
    }
    console.log('Already started playing');
  }

  stopPlay = async () => {
    if (this._isPlaying) {
      this._isPlaying = false;
      return await RNAudioRecorderPlayer.stopPlay();
    }
    console.log('Already stopped playing');
  }

  pausePlay = async () => {
    if (this._isPlaying) {
      this._isPlaying = false;
      return await RNAudioRecorderPlayer.pausePlay();
    }
    console.log('Already paused or stopped');
  }

  seekTo = async (time) => {
    return await RNAudioRecorderPlayer.seekTo(time);
  }
}

export default AudioRecorderPlayer;

