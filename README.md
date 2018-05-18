
# react-native-audio-recorder-player
<p align="left">
  <a href="https://npmjs.org/package/react-native-audio-recorder-player"><img alt="npm version" src="http://img.shields.io/npm/v/react-native-audio-recorder-player.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/react-native-audio-recorder-player"><img alt="npm version" src="http://img.shields.io/npm/dm/react-native-audio-recorder-player.svg?style=flat-square"></a>
</p>

This is a react-native link module for audio recorder and player. This is not a playlist audio module and this library provides simple recorder and player functionalities for both `android` and `ios` platforms. This only supports default file extension for each platform. This module can also handle file from url.

## Preview
[![Alt text for preview](https://firebasestorage.googleapis.com/v0/b/bookoo-89f6c.appspot.com/o/react-native-audio-player-recorder.png?alt=media&token=2512541e-cc0d-45e6-b21e-32e8c24ad99d)](https://firebasestorage.googleapis.com/v0/b/bookoo-89f6c.appspot.com/o/react-native-audio-player-recorder.mp4?alt=media&token=e9e108f8-cd0c-4d4a-85c7-3b8db222249a)

## Getting started

`$ npm install react-native-audio-recorder-player --save`

### Mostly automatic installation

`$ react-native link react-native-audio-recorder-player`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-audio-recorder-player` and add `RNAudioRecorderPlayer.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNAudioRecorderPlayer.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.dooboolab.RNAudioRecorderPlayerPackage;` to the imports at the top of the file
  - Add `new RNAudioRecorderPlayerPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-audio-recorder-player'
  	project(':react-native-audio-recorder-player').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-audio-recorder-player/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-audio-recorder-player')
  	```

### Post installation
On *iOS* you need to add a usage description to `Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This sample uses the microphone to record your speech and convert it to text.</string>
```

On *Android* you need to add a permission to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```
Also, android above `Marshmallow` needs runtime permission to record audio. Using [react-native-permissions](https://github.com/yonahforst/react-native-permissions) will help you out with this problem. Below is sample usage before when started the recording.
```javascript
if (Platform.OS === 'android') {
  const micPermission: string = await checkPermission('microphone');
  console.log('micPermission', micPermission);
  if (micPermission !== 'authorized') {
    const micRequest: string = await requestPermission('microphone');
    console.log('micRequest', micRequest);
    if (micRequest !== 'authorized') {
      return;
    }
  }
  const storagePermission: string = await checkPermission('storage');
  if (storagePermission !== 'authorized') {
    const storageRequest: string = await requestPermission('storage');
    if (storageRequest !== 'authorized') {
      return;
    }
  }
}
```

## Methods
All methods are implemented with promises.

| Func  | Param  | Return | Description |
| :------------ |:---------------:| :---------------:| :-----|
| mmss | `number` seconds | `string` | Convert seconds to `minute:second` string.|
| setRecordInterval |  | `Promise<void>` | Set record interval in second.|
| removeRecordInterval | callBack | `void` | Remove record interval.|
| addPlayBackListener | `Event` | `void` | Get callback from native module. Will receive `duration`, `current_position`|
| startRecord | `<string>` uri? | `Promise<void>` | Start recording. Not passing the param will save audio in default location.|
| stopRecord | | `Promise<string>` | Stop recording.|
| startPlay | `<string>` uri? | `Promise<string>` | Start playing. Not passing the param will play audio in default location.|
| stopPlay | | `Promise<string>` | Stop playing.|
| pausePlay | | `Promise<string>` | Pause playing.|
| seekTo | `number` seconds | `Promise<string>` | Seek audio.|

## Default Path
* Default path for android uri is `sdcard/sound.mp4`.
* Default path for ios uri is `sound.m4a`.

## Usage
```javascript
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

onStartRecord = async () => {
  const result = await audioRecorderPlayer.startRecord();
    audioRecorderPlayer.setRecordInterval(() => {
    const secs = this.state.recordSecs + 1;
    this.setState({
      recordSecs: secs,
      recordTime: audioRecorderPlayer.mmss(secs),
    }, () => {
      console.log(`recordSecs: ${this.state.recordSecs}`);
      console.log(`recordTime: ${this.state.recordTime}`);
    });
  });
  console.log(result);
}

onStopRecord = async () => {
  const result = await audioRecorderPlayer.stopRecord();
  audioRecorderPlayer.removeRecordInterval();
  this.setState({
    recordSecs: 0,
  });
  console.log(result);
}

onStartPlay = async () => {
  console.log('onStartPlay');
  const msg = await audioRecorderPlayer.startPlay();
  console.log(msg);
  audioRecorderPlayer.addPlayBackListener((e) => {
    this.setState({
      currentPositionSec: e.current_position,
      currentDurationSec: e.duration,
      playTime: audioRecorderPlayer.mmss(Math.floor(e.current_position / 1000)),
      duration: audioRecorderPlayer.mmss(Math.floor(e.duration / 1000)),
    });
    return;
  });
}

onPausePlay = async () => {
  await audioRecorderPlayer.pausePlay();
}

onStopPlay = async () => {
  console.log('onStopPlay');
  audioRecorderPlayer.stopPlay();
  audioRecorderPlayer.removePlayBackListener();
}
```

## TIPS
If you want to get actual uri from the record or play file to actually grab it and upload it to your bucket, just grab the resolved message when using `startPlay` or `startRecord` method like below.
```javascript
const path = Platform.select({
  ios: 'hello.m4a',
  android: 'hello.mp4',
});
const uri = await audioRecorderPlayer.startRecord(path);
```
Also, above example helps you to setup manual path to record audio. Not giving path param will record in `default` path and mentioned above.

## Try yourself
1. Goto `Example` folder by running `cd Example`.
2. Run `npm install && npm start`.
3. Run `npm run ios` to run on ios simulator and `npm run android` to run on your android device.
