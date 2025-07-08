# react-native-audio-recorder-player

<img src="Logotype Primary.png" width="70%" />

[![yarn Version](http://img.shields.io/npm/v/react-native-audio-recorder-player.svg?style=flat-square)](https://npmjs.org/package/react-native-audio-recorder-player)
[![Downloads](http://img.shields.io/npm/dm/react-native-audio-recorder-player.svg?style=flat-square)](https://npmjs.org/package/react-native-audio-recorder-player)
[![CI](https://github.com/hyochan/react-native-audio-recorder-player/actions/workflows/ci.yml/badge.svg)](https://github.com/hyochan/react-native-audio-recorder-player/actions/workflows/ci.yml)
[![publish-package](https://github.com/hyochan/react-native-audio-recorder-player/actions/workflows/publish-package.yml/badge.svg)](https://github.com/hyochan/react-native-audio-recorder-player/actions/workflows/publish-package.yml)
![License](http://img.shields.io/npm/l/react-native-audio-recorder-player.svg?style=flat-square)
[![supports iOS](https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff)](https://itunes.apple.com/app/apple-store/id982107779)
[![supports Android](https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff)](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![LICENSE](http://img.shields.io/npm/l/@react-native-seoul/masonry-list.svg?style=flat-square)](https://npmjs.org/package/@react-native-seoul/masonry-list)

**🎉 Version 4.0.0 Released with NitroModule Support!**

This is a high-performance React Native module for audio recording and playback, now powered by [NitroModules](https://github.com/mrousavy/nitro) for direct native module access without bridge overhead. The library provides simple recorder and player functionalities for both Android and iOS platforms with full TypeScript support and type safety.

## Preview

<img src="https://user-images.githubusercontent.com/27461460/117547014-3fe52000-b068-11eb-9f34-2bfc1e5092fd.gif" width=300/>

## Documentation & Resources

- 📚 [Version 4.0.0 Migration Guide](#whats-new-in-400-)
- 📝 [Version 3 Release Note](https://medium.com/dooboolab/react-native-audio-player-and-recorder-v3-7697e25cd07)
- 📰 [Original Blog Post](https://medium.com/@dooboolab/react-native-audio-recorder-and-player-4aa5f26a666)
- 🔧 [NitroModules Documentation](https://github.com/mrousavy/nitro)

## What's New in 4.0.0 🚀

### NitroModule Migration
Version 4.0.0 introduces a complete rewrite using [NitroModules](https://github.com/mrousavy/nitro), offering:
- **Zero Bridge Overhead**: Direct native module access for maximum performance
- **Full Type Safety**: TypeScript definitions generated from native specs
- **Synchronous Methods**: Where appropriate, for better developer experience
- **Event Listeners**: Native callbacks with type-safe event payloads
- **Cross-Platform Code Generation**: Automatic code generation for iOS (Swift) and Android (Kotlin)

### Requirements
- React Native >= 0.73.0
- iOS >= 13.0
- Android minSdk >= 24
- Expo SDK >= 50 (for Expo users)

## Breaking Changes from 3.x

### API Changes
1. **Import Change**: The module is now imported differently:
   ```ts
   // Before (3.x)
   import AudioRecorderPlayer from 'react-native-audio-recorder-player';
   const audioRecorderPlayer = new AudioRecorderPlayer();
   
   // After (4.0.0)
   import { AudioRecorderPlayerNitro } from 'react-native-audio-recorder-player';
   const audioRecorderPlayer = new AudioRecorderPlayerNitro();
   ```

2. **Event Listeners**: New event listener API:
   ```ts
   // Before (3.x)
   audioRecorderPlayer.addRecordBackListener((e) => { ... });
   
   // After (4.0.0)
   audioRecorderPlayer.onRecordingProgress = (e) => { ... };
   audioRecorderPlayer.onPlaybackProgress = (e) => { ... };
   ```

3. **Promise Return Types**: All methods now have proper TypeScript types

### Previous Breaking Changes (3.x)

- From version `3.0.+`, a critical migration has been done. Also note that it supports `iOS` platform version `10.0` or newer.

  1. Codebase has been re-written to [kotlin for Android](https://kotlinlang.org) and [swift for iOS](https://swift.org). Please follow the [post installation](https://github.com/hyochan/react-native-audio-recorder-player#post-installation) for this changes.

     [iOS]

     - [AVAudioPlayer](https://developer.apple.com/documentation/avfaudio/avaudioplayer) has been migrated to [AVPlayer](https://developer.apple.com/documentation/avfoundation/avplayer) which supports stream and more possibilities [#231](https://github.com/hyochan/react-native-audio-recorder-player/issues/231), [#245](https://github.com/hyochan/react-native-audio-recorder-player/issues/245), [#275](https://github.com/hyochan/react-native-audio-recorder-player/issues/275).

  2. `pauseRecorder` and `resumeRecorder` features are added.
     - **Caveat**
       Android now requires `minSdk` of `24`.
  3. Renamed callback variables.

     ```ts
     export type RecordBackType = {
       isRecording?: boolean;
       currentPosition: number;
       currentMetering?: number;
     };

     export type PlayBackType = {
       isMuted?: boolean;
       currentPosition: number;
       duration: number;
     };
     ```

  4. `subscriptionDuration` offset not defaults to `0.5` which is `500ms`.
     - Resolve [#273](https://github.com/hyochan/react-native-audio-recorder-player/issues/273)

## Migration Guide

### From 3.x to 4.0.0 (NitroModule)

| 3.x API                          | 4.0.0 NitroModule API                    |
| -------------------------------- | ---------------------------------------- |
| `new AudioRecorderPlayer()`      | `new AudioRecorderPlayerNitro()`         |
| `addRecordBackListener(cb)`      | `onRecordingProgress = cb`               |
| `removeRecordBackListener()`     | `onRecordingProgress = undefined`        |
| `addPlayBackListener(cb)`        | `onPlaybackProgress = cb`                |
| `removePlayBackListener()`       | `onPlaybackProgress = undefined`         |

### From 1.x to 2.x/3.x

| 1.x.x                  | 2.x.x & 3.x.x             |
| ---------------------- | ------------------------- |
| `startRecord`          | `startRecorder`           |
|                        | `pauseRecorder` (3.x.x)   |
|                        | `resumeRecorder` (3.x.x)  |
| `stopRecord`           | `stopRecorder`            |
| `startPlay`            | `startPlayer`             |
| `stopPlay`             | `stopPlayer`              |
| `pausePlay`            | `pausePlayer`             |
| `resume`               | `resumePlayer`            |
| `seekTo`               | `seekToPlayer`            |
|                        | `setSubscriptionDuration` |
| `addPlayBackListener`  | `addPlayBackListener`     |
| `setRecordInterval`    | `addRecordBackListener`   |
| `removeRecordInterval` | ``                        |
|                        | `setVolume`               |

## Getting started

```sh
bun add react-native-audio-recorder-player
```

Or using npm/yarn:
```sh
npm install react-native-audio-recorder-player
# or
yarn add react-native-audio-recorder-player
```

## Installation

### React Native CLI

#### iOS
```sh
cd ios && pod install
```

#### Android
No additional steps required. The module uses autolinking.

### Post-installation for NitroModule (Required)

After installing the package, you need to run the code generation:

```sh
# Using bun (recommended)
bun x nitro-codegen

# Or using npm/yarn
npx nitro-codegen
# or
yarn nitro-codegen
```

This will generate the necessary native code bindings for both iOS and Android platforms.

### Expo

This library supports Expo SDK 50+ via a config plugin. The plugin handles all native configuration automatically.

#### Installation

```sh
expo install react-native-audio-recorder-player
```

#### Post-installation

For Expo managed workflow, you need to prebuild your app after adding the plugin:

```sh
expo prebuild
```

#### Configuration in app.json / app.config.js

```json
{
  "expo": {
    "plugins": [
      "react-native-audio-recorder-player"
    ]
  }
}
```

Or with custom iOS microphone permission text:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-audio-recorder-player",
        {
          "microphonePermissionText": "This app needs access to your microphone to record audio."
        }
      ]
    ]
  }
}
```

The plugin automatically configures:
- **iOS**: `NSMicrophoneUsageDescription` in Info.plist
- **Android**: `RECORD_AUDIO`, `WRITE_EXTERNAL_STORAGE`, and `READ_EXTERNAL_STORAGE` permissions in AndroidManifest.xml
- **NitroModule**: All necessary native module configurations

⚠️ **Important for Expo users**: After adding the plugin, you must run `expo prebuild` to generate the native code. For development builds, use:
```sh
eas build --profile development --platform all
```

### Manual Installation (Not recommended with NitroModule)

⚠️ **Note**: Manual installation is not recommended for NitroModule 4.0.0. Use autolinking instead.

If you must use manual installation:

1. Follow the standard installation steps
2. Run `bun x nitro-codegen` to generate native bindings
3. The generated code will be in the `nitrogen` directory
4. Link the generated native modules to your project

## Platform-specific Configuration

### iOS Configuration

1. **Microphone Permission**: Add to your `Info.plist`:
   ```xml
   <key>NSMicrophoneUsageDescription</key>
   <string>Give $(PRODUCT_NAME) permission to use your microphone. Your record wont be shared without your permission.</string>
   ```

2. **Minimum iOS Version**: Ensure your minimum deployment target is iOS 13.0 or higher in your `Podfile`:
   ```ruby
   platform :ios, '13.0'
   ```

3. **Swift Support**: The module uses Swift. If your project doesn't have a bridging header, it will be created automatically during pod installation.

### Android Configuration

On _Android_ you need to add a permission to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

If your app requires **broad** access to external storage, you'll need:
```xml
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" tools:ignore="ScopedStorage" />
```

Also, android above `Marshmallow` needs runtime permission to record audio. Using [react-native-permissions](https://github.com/yonahforst/react-native-permissions) will help you out with this problem. Below is sample usage before when before staring the recording.

```ts
if (Platform.OS === 'android') {
  try {
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

    console.log('write external storage', grants);

    if (
      grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      grants['android.permission.READ_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      grants['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Permissions granted');
    } else {
      console.log('All required permissions not granted');
      return;
    }
  } catch (err) {
    console.warn(err);
    return;
  }
}
```

2. **Build Configuration**: Update your `android/build.gradle`:
   ```gradle
   buildscript {
     ext {
         buildToolsVersion = "33.0.0"
         minSdkVersion = 24  // Required for pause/resume features
         compileSdkVersion = 33
         targetSdkVersion = 33
         kotlinVersion = '1.8.0'  // Required for NitroModule
         
         ndkVersion = "23.1.7779620"
     }
   }
   ```

3. **CMake Support**: NitroModule requires CMake for Android. It's automatically configured, but ensure you have CMake installed in Android Studio:
   - Open Android Studio
   - Go to Tools → SDK Manager → SDK Tools
   - Check "CMake" and click "Apply"

## Troubleshooting

### Common Issues

1. **Build Error: "Cannot find module 'react-native-nitro-modules'"**
   - Solution: Run `bun x nitro-codegen` after installation
   
2. **iOS Build Error: "No such module 'NitroAudioRecorderPlayer'"**
   - Solution: Run `cd ios && pod install`
   
3. **Android Build Error: "CMake not found"**
   - Solution: Install CMake through Android Studio SDK Manager
   
4. **Expo Error: "Plugin is not compatible with Expo Go"**
   - Solution: Use development builds with `eas build` or `expo prebuild`

## Methods

### NitroModule API (4.0.0)

| Method                  |                        Param                        |      Return       | Description                                                                            |
| :---------------------- | :-------------------------------------------------: | :---------------: | :------------------------------------------------------------------------------------- |
| mmss                    |                  `number` seconds                   |     `string`      | Convert seconds to `minute:second` string                                              |
| mmssss                  |                  `number` seconds                   |     `string`      | Convert seconds to `minute:second:millisecond` string                                  |
| setSubscriptionDuration |                  `number` duration                  |      `void`       | Set callback interval in ms (default 500ms)                                           |
| startRecorder           |      `string?` uri, `AudioSet?` audioSet,           | `Promise<string>` | Start recording with optional path and audio settings                                  |
|                         |          `boolean?` meteringEnabled                 |                   |                                                                                        |
| pauseRecorder           |                                                     | `Promise<string>` | Pause recording                                                                        |
| resumeRecorder          |                                                     | `Promise<string>` | Resume recording                                                                       |
| stopRecorder            |                                                     | `Promise<string>` | Stop recording and return file path                                                    |
| startPlayer             | `string?` uri, `Record<string, string>?` headers    | `Promise<string>` | Start playback with optional URI and HTTP headers                                      |
| stopPlayer              |                                                     | `Promise<string>` | Stop playback                                                                          |
| pausePlayer             |                                                     | `Promise<string>` | Pause playback                                                                         |
| resumePlayer            |                                                     | `Promise<string>` | Resume playback                                                                        |
| seekToPlayer            |                `number` milliseconds                | `Promise<string>` | Seek to position in milliseconds                                                       |
| setVolume               |                   `number` value                    | `Promise<string>` | Set volume (0.0 - 1.0)                                                                 |
| onRecordingProgress     |          `(event: RecordBackType) => void`          |      `void`       | Set recording progress callback                                                        |
| onPlaybackProgress      |           `(event: PlayBackType) => void`           |      `void`       | Set playback progress callback                                                         |

### Legacy API (for backward compatibility)

| Method                  |                        Param                        |      Return       | Description                                                                            |
| :---------------------- | :-------------------------------------------------: | :---------------: | :------------------------------------------------------------------------------------- |
| addRecordBackListener   |                 `Function` callBack                 |      `void`       | Add recording progress listener (deprecated, use onRecordingProgress)                  |
| removeRecordBackListener|                 `Function` callBack                 |      `void`       | Remove recording listener                                                              |
| addPlayBackListener     |                 `Function` callBack                 |      `void`       | Add playback progress listener (deprecated, use onPlaybackProgress)                    |
| removePlayBackListener  |                 `Function` callBack                 |      `void`       | Remove playback listener                                                               |

## Customizing Audio Quality

### Audio Configuration Options

```typescript
interface AudioSet {
  // iOS Options
  AVSampleRateKeyIOS?: number;              // Sample rate (e.g., 44100)
  AVFormatIDKeyIOS?: AVEncodingType;        // Audio format (e.g., aac, mp4)
  AVModeIOS?: AVModeType;                   // Audio session mode
  AVNumberOfChannelsKeyIOS?: number;        // Number of channels (1 = mono, 2 = stereo)
  AVEncoderAudioQualityKeyIOS?: AVEncoderAudioQualityIOSType; // Quality level
  
  // Android Options
  AudioSourceAndroid?: AudioSourceAndroidType;     // Audio source (e.g., MIC)
  OutputFormatAndroid?: OutputFormatAndroidType;   // Output format
  AudioEncoderAndroid?: AudioEncoderAndroidType;   // Encoder type
}
```

### Example Configuration

```typescript
const audioSet: AudioSet = {
  // iOS Settings
  AVSampleRateKeyIOS: 44100,
  AVFormatIDKeyIOS: AVEncodingOption.aac,
  AVModeIOS: AVModeIOSOption.measurement,
  AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
  AVNumberOfChannelsKeyIOS: 2,
  
  // Android Settings
  AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
  AudioSourceAndroid: AudioSourceAndroidType.MIC,
  OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
};

const meteringEnabled = true; // Enable audio metering

const uri = await audioRecorderPlayer.startRecorder(
  undefined, // Use default path
  audioSet,
  meteringEnabled
);
```

## Default Path

- Default path for android uri is `{cacheDir}/sound.mp4`.
- Default path for ios uri is `{cacheDir}/sound.m4a`.

## Usage

### Basic Usage with NitroModule (4.0.0)

```typescript
import { AudioRecorderPlayerNitro } from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayerNitro();

// Recording
const onStartRecord = async () => {
  // Set up recording progress listener
  audioRecorderPlayer.onRecordingProgress = (e) => {
    console.log('Recording progress:', e.currentPosition, e.currentMetering);
    setState({
      recordSecs: e.currentPosition,
      recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
    });
  };
  
  const result = await audioRecorderPlayer.startRecorder();
  console.log('Recording started:', result);
};

const onStopRecord = async () => {
  const result = await audioRecorderPlayer.stopRecorder();
  audioRecorderPlayer.onRecordingProgress = undefined; // Clear listener
  console.log('Recording stopped:', result);
};

// Playback
const onStartPlay = async () => {
  // Set up playback progress listener
  audioRecorderPlayer.onPlaybackProgress = (e) => {
    console.log('Playback progress:', e.currentPosition, e.duration);
    setState({
      currentPositionSec: e.currentPosition,
      currentDurationSec: e.duration,
      playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
    });
  };
  
  const result = await audioRecorderPlayer.startPlayer();
  console.log('Playback started:', result);
};

const onPausePlay = async () => {
  await audioRecorderPlayer.pausePlayer();
};

const onStopPlay = async () => {
  audioRecorderPlayer.stopPlayer();
  audioRecorderPlayer.onPlaybackProgress = undefined; // Clear listener
};
```

### Legacy API (for backward compatibility)

If you need to maintain backward compatibility, you can still use the legacy API:

```javascript
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

// Legacy callback style still works
audioRecorderPlayer.addRecordBackListener((e) => {
  // Handle recording progress
});
```

## TIPS

If you want to get actual uri from the record or play file to actually grab it and upload it to your bucket, just grab the resolved message when using `startPlay` or `startRecord` method like below.

To access the file with more reliability, please use [react-native-blob-util](https://www.npmjs.com/package/react-native-blob-util) or [react-native-file-access](https://github.com/alpha0010/react-native-file-access). See below for examples.

`react-native-blob-util`
```ts
import ReactNativeBlobUtil from 'react-native-blob-util'
...
const dirs = ReactNativeBlobUtil.fs.dirs;
const path = Platform.select({
  ios: 'hello.m4a',
  android: `${dirs.CacheDir}/hello.mp3`,
});

const uri = await audioRecorderPlayer.startRecord(path);
```

Also, above example helps you to setup manual path to record audio. Not giving path param will record in `default` path as mentioned above.

To pass in specific URI in IOS, you need to append `file://` to the path. As an example using [RFNS](https://github.com/itinance/react-native-fs).

```javascript
import RNFetchBlob from 'rn-fetch-blob';
...
const dirs = RNFetchBlob.fs.dirs;
const path = Platform.select({
  ios: `file://${RNFS.DocumentDirectoryPath}/hello.m4a`,
  android: `${this.dirs.CacheDir}/hello.mp3`,
});

const uri = await audioRecorderPlayer.startRecord(path);
```

`react-native-file-access`
```ts
import { Dirs } from "react-native-file-access";
...
const path = Platform.select({
  ios: 'hello.m4a',
  android: `${Dirs.CacheDir}/hello.mp3`,
});

const uri = await audioRecorderPlayer.startRecord(path);
```



## Example App

### Running the Example

1. Navigate to the example directory:
   ```sh
   cd Example
   ```

2. Install dependencies:
   ```sh
   bun install
   ```

3. Generate NitroModule bindings:
   ```sh
   bun x nitro-codegen
   ```

4. Start the development server:
   ```sh
   bun start
   ```

5. Run on your platform:
   ```sh
   # iOS
   bun ios
   
   # Android
   bun android
   ```

## Special Thanks

[mansya](https://github.com/mansya) - logo designer.

## Help Maintenance

I've been maintaining quite many repos these days and burning out slowly. If you could help me cheer up, buying me a cup of coffee will make my life really happy and get much energy out of it.
<br/>
<a href="https://www.buymeacoffee.com/hyochan" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
[![Paypal](https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png)](https://paypal.me/dooboolab)
