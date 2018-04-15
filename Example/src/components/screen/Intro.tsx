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
} from 'react-native';

import { ratio, colors } from '@utils/Styles';
import { IC_MASK } from '@utils/Icons';

import { getString } from '@STRINGS';
import User from '@models/User';
import Button from '@shared/Button';
import { inject } from 'mobx-react/native';

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
  view: {
    marginTop: 100 * ratio,
    width: '100%',
    alignItems: 'center',
  },
  viewBar: {
    backgroundColor: '#ccc',
    height: 4 * ratio,
    marginHorizontal: 28 * ratio,
    alignSelf: 'stretch',
  },
  viewBarPlay: {
    backgroundColor: 'white',
    height: 4 * ratio,
    width: '40%',
    alignSelf: 'stretch',
  },
  statusTxt: {
    marginTop: 8 * ratio,
    color: '#ccc',
  },
  btnWrapper: {
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
});

interface IState {
  isLoggingIn: boolean;
}

@inject('store')
class Page extends Component<any, IState> {
  private timer: any;

  constructor(props) {
    super(props);
    this.state = {
      isLoggingIn: false,
      status: 'STOPPED',
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
        <TouchableOpacity
          style={styles.view}
          onPress={this.onStatusPress}
        >
          <View style={styles.viewBar}>
            <View style={styles.viewBarPlay}/>
          </View>
        </TouchableOpacity>
        <Text style={styles.statusTxt}>{this.state.status}</Text>
        <View style={styles.btnWrapper}>
          <Button
            style={styles.btn}
            onPress={this.onPlay}
            textStyle={styles.txt}
          >{getString('PLAY')}</Button>
          <Button
            style={[
              styles.btn,
              {
                marginLeft: 12 * ratio,
              },
            ]}
            onPress={this.onPause}
            textStyle={styles.txt}
            >{getString('PAUSE')}</Button>
          <Button
            style={[
              styles.btn,
              {
                marginLeft: 12 * ratio,
              },
            ]}
            onPress={this.onStop}
            textStyle={styles.txt}
            >{getString('STOP')}</Button>
          <Button
            style={[
              styles.btn,
              {
                marginLeft: 12 * ratio,
              },
            ]}
            onPress={this.onRecord}
            textStyle={styles.txt}
          >{getString('RECORD')}</Button>
        </View>
      </View>
    );
  }

  private onStatusPress = () => {
    console.log('onStatusPress');
  }

  private onPlay = () => {
    console.log('onPlay');
  }

  private onPause = () => {
    console.log('onPause');
  }

  private onStop = () => {
    console.log('onStop');
  }

  private onRecord = () => {
    console.log('onRecord');
  }
}

export default Page;
