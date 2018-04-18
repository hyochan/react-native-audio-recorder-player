import React, { Component } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  View,
  FlatList,
  InteractionManager,
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
} from 'react-native';

import { ratio, colors } from '@utils/Styles';
import { IC_MASK } from '@utils/Icons';

import { getString } from '@STRINGS';
import User from '@models/User';
import Button from '@shared/Button';
import { inject } from 'mobx-react/native';

import RNAudioRecorderPlayer from 'react-native-audio-recorder-player';

const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleTxt: {
    marginTop: 100 * ratio,
    color: 'white',
    fontSize: 28 * ratio,
  },
  viewRecorder: {
    marginTop: 40 * ratio,
    width: '100%',
    alignItems: 'center',
  },
  recordBtnWrapper: {
    flexDirection: 'row',
  },
  viewPlayer: {
    marginTop: 60 * ratio,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  viewBarWrapper: {
    backgroundColor: '#ccc',
    height: 4 * ratio,
    marginTop: 28 * ratio,
    marginHorizontal: 28 * ratio,
    alignSelf: 'stretch',
  },
  viewBarPlay: {
    backgroundColor: 'white',
    height: 4 * ratio,
    width: 0,
    alignSelf: 'stretch',
  },
  playStatusTxt: {
    marginTop: 8 * ratio,
    color: '#ccc',
  },
  playBtnWrapper: {
    flexDirection: 'row',
    marginTop: 40 * ratio,
  },
  btn: {
    borderColor: 'white',
    borderWidth: 1 * ratio,
  },
  txt: {
    color: 'white',
    fontSize: 14 * ratio,
    marginHorizontal: 8 * ratio,
    marginVertical: 4 * ratio,
  },
  txtCounter: {
    marginTop: 12 * ratio,
    color: 'white',
    fontSize: 20 * ratio,
  },
});

interface IState {
  isLoggingIn: boolean;
}

@inject('store')
class Page extends Component<any, IState> {
  private timer: any;
  private subscription: any;

  constructor(props) {
    super(props);
    this.state = {
      isLoggingIn: false,
      playTime: '00:00',
      duration: '00:00',
    };
  }

  public componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  public render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleTxt}>{getString('TITLE')}</Text>
        <View style={styles.viewRecorder}>
          <View style={styles.recordBtnWrapper}>
            <Button
              style={styles.btn}
              onPress={this.onStartRecord}
              textStyle={styles.txt}
            >{getString('RECORD')}</Button>
            <Button
              style={[
                styles.btn,
                {
                  marginLeft: 12 * ratio,
                },
              ]}
              onPress={this.onStopRecord}
              textStyle={styles.txt}
            >{getString('STOP')}</Button>
          </View>
        </View>
        <View style={styles.viewPlayer}>
          <TouchableOpacity
            style={styles.viewBarWrapper}
            onPress={this.onStatusPress}
          >
            <View style={styles.viewBar}>
              <View style={styles.viewBarPlay}/>
            </View>
          </TouchableOpacity>
          <Text style={styles.txtCounter}>{this.state.playTime} / {this.state.duration}</Text>
          <View style={styles.playBtnWrapper}>
            <Button
              style={styles.btn}
              onPress={this.onStartPlay}
              textStyle={styles.txt}
            >{getString('PLAY')}</Button>
            <Button
              style={[
                styles.btn,
                {
                  marginLeft: 12 * ratio,
                },
              ]}
              onPress={this.onStopPlay}
              textStyle={styles.txt}
              >{getString('STOP')}</Button>
          </View>
        </View>
      </View>
    );
  }

  private mmss = (secs) => {
    let minutes = Math.floor(secs / 60);
    secs = secs % 60;
    minutes = minutes % 60;
    minutes = ('0' + minutes).slice(-2);
    secs = ('0' + secs).slice(-2);
    return minutes + ':' + secs;
  }

  private onStatusPress = () => {
    console.log('onStatusPress');
  }

  private onStartRecord = async () => {
    console.log('onStartRecord');
    const result = await RNAudioRecorderPlayer.startRecord('DEFAULT');
    console.log(result);
  }

  private onStopRecord = async () => {
    console.log('onStopRecord');
    const result = await RNAudioRecorderPlayer.stopRecord();
    console.log(result);
  }

  private onStartPlay = async () => {
    if (Platform.OS === 'android') {
      this.subscription = DeviceEventEmitter.addListener('rn-playback', (e: Event) => {
        this.setState({
          playTime: this.mmss(Math.round(e.current_position / 1000)),
          duration: this.mmss(Math.round(e.duration / 1000)),
        });
      });
    } else {
      const myModuleEvt = new NativeEventEmitter(RNAudioRecorderPlayer);
      myModuleEvt.addListener('rn-playback', (data) => {
        this.setState({
          playTime: this.mmss(Math.round(data.current_position)),
          duration: this.mmss(Math.round(data.duration)),
        });
        console.log(data.current_position);
      });
    }

    console.log('onStartPlay');
    // 'https://coonidev.blob.core.windows.net/audios-activity/094785446ae05822fe9e663172357673.mp3',
    const result = await RNAudioRecorderPlayer.startPlay('DEFAULT');
    console.log(result);
  }

  private onStopPlay = async () => {
    console.log('onStopPlay');
    const result = await RNAudioRecorderPlayer.stopPlay();
    console.log(result);
    if (this.subscription) {
      this.subscription.remove();
    }
  }
}

export default Page;
