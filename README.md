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

**🎉 Version 4.1.0 Released with NitroModule Support!**

> ⚠️ **Important**: Version 4.0.0 had issues with Nitro integration. Please install version 4.1.0 or later.

This is a high-performance React Native module for audio recording and playback, now powered by [NitroModules](https://github.com/mrousavy/nitro) for direct native module access without bridge overhead. The library provides simple recorder and player functionalities for both Android and iOS platforms with full TypeScript support and type safety.

## Preview

<img src="https://user-images.githubusercontent.com/27461460/117547014-3fe52000-b068-11eb-9f34-2bfc1e5092fd.gif" width=300/>

## Documentation & Resources

- 📚 [Migration Guide](./docs/MIGRATION.md) - For migrating from older versions
- 🔧 [NitroModules Documentation](https://github.com/mrousavy/nitro) - Learn about the underlying technology
- 📝 [Version 3 Release Note](https://medium.com/dooboolab/react-native-audio-player-and-recorder-v3-7697e25cd07)
- 📰 [Original Blog Post](https://medium.com/@dooboolab/react-native-audio-recorder-and-player-4aa5f26a666)

## What's New in 4.0.0 🚀

### NitroModule Migration

Version 4.0.0 introduces a complete rewrite using [NitroModules](https://github.com/mrousavy/nitro), offering:

- **Zero Bridge Overhead**: Direct native module access for maximum performance
- **Full Type Safety**: TypeScript definitions generated from native specs
- **Synchronous Methods**: Where appropriate, for better developer experience
- **Event Listeners**: Native callbacks with type-safe event payloads
- **Cross-Platform Code Generation**: Automatic code generation for iOS (Swift) and Android (Kotlin)
- **Background Processing**: Recording operations now run in background threads to prevent UI blocking, requiring loading state management

### Requirements

- React Native >= 0.73.0
- iOS >= 13.0
- Android minSdk >= 24
- Expo SDK >= 50 (for Expo users)

## Migration from Older Versions

If you're upgrading from version 3.x or earlier, please refer to our [Migration Guide](./docs/MIGRATION.md) for detailed instructions and breaking changes.

## Getting started

> ⚠️ **Important**: Install version 4.1.0 or later to avoid Nitro integration issues from version 4.0.0.

1. **Install packages**:

   ```sh
   yarn add react-native-audio-recorder-player react-native-nitro-modules
   ```

   Or using npm:

   ```sh
   npm install react-native-audio-recorder-player react-native-nitro-modules
   ```

## Post Installation

After installing the packages, follow these steps:

1. **iOS Setup**:
   ```sh
   cd ios && pod install
   ```

2. **Android Setup**:
   No additional steps required. The module uses autolinking.

> **Note**: The `nitro-codegen` command is already run during the library's build process. You don't need to run it in your application.

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

### Android Configuration

On _Android_ you need to add permissions to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

Also, android above `Marshmallow` needs runtime permission to record audio. Below is sample usage:

```ts
if (Platform.OS === 'android') {
  try {
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

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

## Methods

| Method                   |                      Param                       |      Return       | Description                                           |
| :----------------------- | :----------------------------------------------: | :---------------: | :---------------------------------------------------- |
| mmss                     |                 `number` seconds                 |     `string`      | Convert seconds to `minute:second` string             |
| mmssss                   |                 `number` seconds                 |     `string`      | Convert seconds to `minute:second:millisecond` string |
| setSubscriptionDuration  |                `number` duration                 |      `void`       | Set callback interval in ms (default 500ms)           |
| startRecorder            |       `string?` uri, `AudioSet?` audioSet,       | `Promise<string>` | Start recording with optional path and audio settings |
|                          |            `boolean?` meteringEnabled            |                   |                                                       |
| pauseRecorder            |                                                  | `Promise<string>` | Pause recording                                       |
| resumeRecorder           |                                                  | `Promise<string>` | Resume recording                                      |
| stopRecorder             |                                                  | `Promise<string>` | Stop recording and return file path                   |
| startPlayer              | `string?` uri, `Record<string, string>?` headers | `Promise<string>` | Start playback with optional URI and HTTP headers     |
| stopPlayer               |                                                  | `Promise<string>` | Stop playback                                         |
| pausePlayer              |                                                  | `Promise<string>` | Pause playback                                        |
| resumePlayer             |                                                  | `Promise<string>` | Resume playback                                       |
| seekToPlayer             |              `number` milliseconds               | `Promise<string>` | Seek to position in milliseconds                      |
| setVolume                |                  `number` value                  | `Promise<string>` | Set volume (0.0 - 1.0)                                |
| setPlaybackSpeed         |                  `number` speed                  | `Promise<string>` | Set playback speed (0.5 - 2.0)                        |
| addRecordBackListener    |               `Function` callback                |      `void`       | Add recording progress listener                       |
| removeRecordBackListener |                                                  |      `void`       | Remove recording progress listener                    |
| addPlayBackListener      |               `Function` callback                |      `void`       | Add playback progress listener                        |
| removePlayBackListener   |                                                  |      `void`       | Remove playback progress listener                     |

## Usage

### Basic Usage

```typescript
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  RecordBackType,
  PlayBackType,
} from 'react-native-audio-recorder-player';

// AudioRecorderPlayer is a singleton instance, use directly

// Recording
const onStartRecord = async () => {
  // Set up recording progress listener
  AudioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
    console.log('Recording progress:', e.currentPosition, e.currentMetering);
    setRecordSecs(e.currentPosition);
    setRecordTime(AudioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
  });

  const result = await AudioRecorderPlayer.startRecorder();
  console.log('Recording started:', result);
};

const onStopRecord = async () => {
  const result = await AudioRecorderPlayer.stopRecorder();
  AudioRecorderPlayer.removeRecordBackListener();
  console.log('Recording stopped:', result);
};

// Playback
const onStartPlay = async () => {
  // Set up playback progress listener
  AudioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
    console.log('Playback progress:', e.currentPosition, e.duration);
    setCurrentPosition(e.currentPosition);
    setTotalDuration(e.duration);
    setPlayTime(AudioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    setDuration(AudioRecorderPlayer.mmssss(Math.floor(e.duration)));
  });

  const result = await AudioRecorderPlayer.startPlayer();
  console.log('Playback started:', result);
};

const onPausePlay = async () => {
  await AudioRecorderPlayer.pausePlayer();
};

const onStopPlay = async () => {
  AudioRecorderPlayer.stopPlayer();
  AudioRecorderPlayer.removePlayBackListener();
};

// Seeking
const seekTo = async (milliseconds: number) => {
  await AudioRecorderPlayer.seekToPlayer(milliseconds);
};

// Volume control
const setVolume = async (volume: number) => {
  await AudioRecorderPlayer.setVolume(volume); // 0.0 - 1.0
};

// Speed control
const setSpeed = async (speed: number) => {
  await AudioRecorderPlayer.setPlaybackSpeed(speed); // 0.5 - 2.0
};
```

### Audio Configuration

```typescript
const audioSet: AudioSet = {
  // iOS Settings
  AVSampleRateKeyIOS: 44100,
  AVFormatIDKeyIOS: AVEncodingOption.aac,
  AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
  AVNumberOfChannelsKeyIOS: 2,

  // Android Settings
  AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
  AudioSourceAndroid: AudioSourceAndroidType.MIC,
};

const meteringEnabled = true; // Enable audio metering

const uri = await AudioRecorderPlayer.startRecorder(
  undefined, // Use default path
  audioSet,
  meteringEnabled
);
```

## Default Path

- Default path for android uri is `{cacheDir}/sound.mp4`.
- Default path for ios uri is `{cacheDir}/sound.m4a`.

## Component-Based Implementation

For better code organization, consider separating recording and playback into separate components:

### Important: Loading States

> **Note**: Starting from version 4.x, recording operations (start/stop) are processed in the background to prevent UI blocking. This means there's a slight delay between calling the method and the actual operation completing. **We strongly recommend implementing loading states** to provide better user experience.

### AudioRecorder Component with Loading States

```typescript
import React, { useState } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');

  const onStartRecord = async () => {
    setIsLoading(true);
    try {
      const result = await AudioRecorderPlayer.startRecorder();
      AudioRecorderPlayer.addRecordBackListener((e) => {
        setRecordTime(AudioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      });
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onStopRecord = async () => {
    setIsLoading(true);
    try {
      const result = await AudioRecorderPlayer.stopRecorder();
      AudioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      onRecordingComplete?.(result);
    } catch (error) {
      console.error('Failed to stop recording:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Text>{recordTime}</Text>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? onStopRecord : onStartRecord}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator />}
    </View>
  );
};
```

### AudioPlayer Component with Loading States

```typescript
import React, { useState } from 'react';
import { View, Button, Text, ActivityIndicator } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export const AudioPlayer = ({ audioPath }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');

  const onStartPlay = async () => {
    setIsLoading(true);
    try {
      const msg = await AudioRecorderPlayer.startPlayer(audioPath);
      AudioRecorderPlayer.addPlayBackListener((e) => {
        setPlayTime(AudioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
        setDuration(AudioRecorderPlayer.mmssss(Math.floor(e.duration)));
        
        // Auto-stop when playback completes
        if (e.duration > 0 && e.currentPosition >= e.duration - 100) {
          setIsPlaying(false);
          AudioRecorderPlayer.removePlayBackListener();
        }
      });
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to start playback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onStopPlay = async () => {
    setIsLoading(true);
    try {
      await AudioRecorderPlayer.stopPlayer();
      AudioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
      setPlayTime('00:00:00');
      setDuration('00:00:00');
    } catch (error) {
      console.error('Failed to stop playback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Text>{playTime} / {duration}</Text>
      <Button
        title={isPlaying ? 'Stop' : 'Play'}
        onPress={isPlaying ? onStopPlay : onStartPlay}
        disabled={!audioPath || isLoading}
      />
      {isLoading && <ActivityIndicator />}
    </View>
  );
};
```

## Example App

### Running the Example

1. Navigate to the example directory:

   ```sh
   cd example
   ```

2. Install dependencies:

   ```sh
   yarn install
   ```

3. Start the development server:

   ```sh
   yarn start
   ```

4. Run on your platform:

   ```sh
   # iOS
   yarn ios

   # Android
   yarn android
   ```

## Troubleshooting

### iOS Recording Error: "Unknown std::runtime_error"

If you encounter this error when trying to record on iOS:

1. **Ensure microphone permissions are properly configured** in your `Info.plist`:
   ```xml
   <key>NSMicrophoneUsageDescription</key>
   <string>Your app needs microphone access to record audio</string>
   ```

2. **Clean and rebuild your iOS project**:
   ```sh
   cd ios
   rm -rf build Pods
   pod install
   cd ..
   yarn ios
   ```

3. **Make sure you're testing on a real device** if using the simulator doesn't work. Some audio features require real hardware.

4. **Verify the Nitro modules are properly linked** by checking that the `[NitroModules] 🔥 AudioRecorderPlayer is boosted by nitro!` message appears during `pod install`.

### Common Issues

- **"nitro-codegen" command not found**: This command is only needed when developing the library itself, not when using it in your app.
- **Module not found errors**: Make sure to run `pod install` after installing the package.
- **Android build issues**: Ensure your `minSdkVersion` is 24 or higher in `android/build.gradle`.

### Clean Build Instructions

If you're experiencing build issues or runtime errors after updating the library:

#### iOS Clean Build
```sh
cd ios
rm -rf ~/Library/Caches/CocoaPods
rm -rf Pods
rm -rf ~/Library/Developer/Xcode/DerivedData/*
pod cache clean --all
pod install
cd ..
```

Then in Xcode:
1. Product → Clean Build Folder (⇧⌘K)
2. Product → Build (⌘B)

#### Android Clean Build
```sh
cd android
./gradlew clean
rm -rf ~/.gradle/caches/
cd ..
```

Then rebuild:
```sh
yarn android
# or
npx react-native run-android
```

#### Both Platforms
You can also try resetting Metro cache:
```sh
npx react-native start --reset-cache
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
