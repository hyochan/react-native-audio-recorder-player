
import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  Platform,
} from 'react-native';

const { RNAudioRecorderPlayer } = NativeModules;

class AudioRecorderPlayer {
  static _subscription;

  mmss = (secs) => {
    let minutes = Math.floor(secs / 60);
    secs = secs % 60;
    minutes = minutes % 60;
    minutes = ('0' + minutes).slice(-2);
    secs = ('0' + secs).slice(-2);
    return minutes + ':' + secs;
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
    return await RNAudioRecorderPlayer.startRecord('DEFAULT');
  }

  stopRecord = async() => {
    return await RNAudioRecorderPlayer.stopRecord();
  }

  startPlay = async () => {
    return await RNAudioRecorderPlayer.startPlay('DEFAULT');
  }

  stopPlay = async () => {
    return await RNAudioRecorderPlayer.stopPlay();
  }

  pausePlay = async () => {
    return await RNAudioRecorderPlayer.pausePlay();
  }

  seekTo = async (time) => {
    return await RNAudioRecorderPlayer.seekTo(time);
  }
}

export default AudioRecorderPlayer;

