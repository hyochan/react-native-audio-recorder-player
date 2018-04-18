
# react-native-audio-recorder-player
<p align="left">
  <a href="https://npmjs.org/package/react-native-audio-recorder-player"><img alt="npm version" src="http://img.shields.io/npm/v/react-native-audio-recorder-player.svg?style=flat-square"></a>
  <a href="https://npmjs.org/package/react-native-audio-recorder-player"><img alt="npm version" src="http://img.shields.io/npm/dm/react-native-audio-recorder-player.svg?style=flat-square"></a>
</p>

This is a react-native link library project for audio recorder and player. Under construction.

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


## Usage
```javascript
import RNAudioRecorderPlayer from 'react-native-audio-recorder-player';

// TODO: What to do with the module?
RNAudioRecorderPlayer;
```
  