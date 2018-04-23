
# react-native-audio-recorder-player
<p align="left">
  <a href="https://npmjs.org/package/react-native-audio-recorder-player"><img alt="npm version" src="http://img.shields.io/npm/v/react-native-audio-recorder-player.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/react-native-audio-recorder-player"><img alt="npm version" src="http://img.shields.io/npm/dm/react-native-audio-recorder-player.svg?style=flat-square"></a>
</p>

This is a react-native link library project for audio recorder and player. This is not a playlist audio module and this library provides simple recorder and player functionalities.

## Preview
[![Watch the video](https://firebasestorage.googleapis.com/v0/b/bookoo-89f6c.appspot.com/o/react-native-audio-player-recorder.mp4?alt=media&token=e9e108f8-cd0c-4d4a-85c7-3b8db222249a)]

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

## Methods
| Func  | Param  | Return | Description |
| :------------ |:---------------:| :---------------:| :-----|
| mmss | `number` seconds | `string` | Convert seconds to `minute:second` string.|
| setRecordInterval |  | `Promise<void>` | Set record interval in second.|
| removeRecordInterval | callBack | `void` | Remove record interval.|
| addPlayBackListener | e: Event | `void` | Get callback from native module. Will receive `duration`, `current_position`|
| startRecord | `<string>` uri? | `Promise<void>` | Start recording. Not passing the param will save audio in default location.|
| stopRecord | | `Promise<void>` | Stop recording.|
| startPlay | `<string>` uri? | `Promise<void>` | Start playing. Not passing the param will play audio in default location.|
| stopPlay | | `Promise<void>` | Stop playing.|
| pausePlay | | `Promise<void>` | Pause playing.|
| seekTo | `number` seconds | `Promise<string>` | Seek audio.|


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
  