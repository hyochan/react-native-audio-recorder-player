import React, { Component, SyntheticEvent } from 'react';
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
} from 'react-native';

import { ratio, colors, screenWidth } from '@utils/Styles';
import { IC_MASK } from '@utils/Icons';

import { getString } from '@STRINGS';
import User from '@models/User';
import Button from '@shared/Button';
import { inject } from 'mobx-react/native';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';

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
    marginTop: 28 * ratio,
    marginHorizontal: 28 * ratio,
    alignSelf: 'stretch',
  },
  viewBar: {
    backgroundColor: '#ccc',
    height: 4 * ratio,
    alignSelf: 'stretch',
  },
  viewBarPlay: {
    backgroundColor: 'white',
    height: 4 * ratio,
    width: 0,
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
  txtRecordCounter: {
    marginTop: 32 * ratio,
    color: 'white',
    fontSize: 20 * ratio,
  },
  txtCounter: {
    marginTop: 12 * ratio,
    color: 'white',
    fontSize: 20 * ratio,
  },
});

interface IState {
  isLoggingIn: boolean;
  recordSecs: number;
  recordTime: string;
  currentPositionSec: number;
  currentDurationSec: number;
  playTime: string;
  duration: string;
}

@inject('store')
class Page extends Component<any, IState> {
  private timer: any;
  private subscription: any;
  private audioRecorderPlayer: any;

  constructor(props) {
    super(props);
    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime: '00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00',
      duration: '00:00',
    };

    this.audioRecorderPlayer = new AudioRecorderPlayer();
  }

  public componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  public render() {
    const playWidth = (this.state.currentPositionSec / this.state.currentDurationSec) * (screenWidth - 56 * ratio);
    return (
      <View style={styles.container}>
        <Text style={styles.titleTxt}>{getString('TITLE')}</Text>
        <Text style={styles.txtRecordCounter}>{this.state.recordTime}</Text>
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
              <View style={[
                styles.viewBarPlay,
                { width: playWidth },
              ]}/>
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
              onPress={this.onPausePlay}
              textStyle={styles.txt}
            >{getString('PAUSE')}</Button>
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

  private onStatusPress = (e: any) => {
    const touchX = e.nativeEvent.locationX;
    console.log(`touchX: ${touchX}`);
    const playWidth = (this.state.currentPositionSec / this.state.currentDurationSec) * (screenWidth - 56 * ratio);
    console.log(`currentPlayWidth: ${playWidth}`);

    const currentPosition = Math.round(this.state.currentPositionSec);
    console.log(`currentPosition: ${currentPosition}`);

    if (playWidth && playWidth < touchX) {
      const addSecs = Math.round((currentPosition + 3000) / 1000);
      this.audioRecorderPlayer.seekTo(addSecs);
      console.log(`addSecs: ${addSecs}`);
    } else {
      const subSecs = Math.round((currentPosition - 3000) / 1000);
      this.audioRecorderPlayer.seekTo(subSecs);
      console.log(`addSecs: ${subSecs}`);
    }
  }

  private onStartRecord = async () => {
    const result = await this.audioRecorderPlayer.startRecord();
    this.audioRecorderPlayer.setRecordInterval(1000, () => {
      const secs = this.state.recordSecs + 1;
      this.setState({
        recordSecs: secs,
        recordTime: this.audioRecorderPlayer.mmss(secs),
      }, () => {
        console.log(`recordSecs: ${this.state.recordSecs}`);
        console.log(`recordTime: ${this.state.recordTime}`);
      });
    });
    console.log(result);
  }

  private onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecord();
    this.audioRecorderPlayer.removeRecordInterval();
    this.setState({
      recordSecs: 0,
    });
    console.log(result);
  }

  private onStartPlay = async () => {
    console.log('onStartPlay');
    const msg = await this.audioRecorderPlayer.startPlay();
    console.log(msg);
    this.audioRecorderPlayer.addPlayBackListener((e) => {
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmss(Math.floor(e.current_position / 1000)),
        duration: this.audioRecorderPlayer.mmss(Math.floor(e.duration / 1000)),
      });
      return;
    });
  }

  private onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlay();
  }

  private onStopPlay = async () => {
    console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlay();
    this.audioRecorderPlayer.removePlayBackListener();
  }
}

export default Page;
