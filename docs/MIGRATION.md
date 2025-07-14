# Migration Guide

This guide covers migration from older versions of react-native-audio-recorder-player to the latest version.

## Migration to 4.x (NitroModules)

Version 4.0.0 introduces a complete rewrite using [NitroModules](https://github.com/mrousavy/nitro), offering:

- **Zero Bridge Overhead**: Direct native module access for maximum performance
- **Full Type Safety**: TypeScript definitions generated from native specs
- **Synchronous Methods**: Where appropriate, for better developer experience
- **Event Listeners**: Native callbacks with type-safe event payloads
- **Cross-Platform Code Generation**: Automatic code generation for iOS (Swift) and Android (Kotlin)

### Breaking Changes from 3.x

#### 1. Import Change

The module now exports a singleton instance:

```ts
// Before (3.x)
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
const audioRecorderPlayer = new AudioRecorderPlayer();

// After (4.0.0)
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// AudioRecorderPlayer is already a singleton instance, use directly
```

#### 2. Event Listeners

Updated event listener API:

```ts
// Recording progress
AudioRecorderPlayer.addRecordBackListener((e) => {
  console.log('Recording:', e.currentPosition, e.currentMetering);
});

// Playback progress
AudioRecorderPlayer.addPlayBackListener((e) => {
  console.log('Playback:', e.currentPosition, e.duration);
});
```

#### 3. Promise Return Types

All methods now have proper TypeScript types.

### Requirements for 4.x

- React Native >= 0.73.0
- iOS >= 13.0
- Android minSdk >= 24
- Expo SDK >= 50 (for Expo users)

## Migration from 2.x to 3.x

Version 3.0.0 introduced several breaking changes:

1. **Codebase Migration**: Re-written in Kotlin for Android and Swift for iOS
2. **iOS Player Change**: Migrated from AVAudioPlayer to AVPlayer for better streaming support
3. **New Features**: Added `pauseRecorder` and `resumeRecorder` methods
4. **Minimum Requirements**: Android now requires minSdk 24

### Renamed Callback Variables

```ts
export type RecordBackType = {
  isRecording?: boolean;
  currentPosition: number;
  currentMetering?: number;
  recordSecs: number;
};

export type PlayBackType = {
  isMuted?: boolean;
  currentPosition: number;
  duration: number;
};
```

### Other Changes

- `subscriptionDuration` now defaults to `0.5` (500ms)

## Migration from 1.x to 2.x/3.x

### Method Name Changes

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

## Legacy Platform Requirements

### Version 3.x
- iOS platform version 10.0 or newer
- Android minSdk 24

### Version 2.x
- iOS platform version 10.0 or newer
- Android minSdk 16

## Common Migration Issues

### iOS Issues

1. **AVPlayer Migration (3.x)**: The player was changed from AVAudioPlayer to AVPlayer. This provides better streaming support but may require adjusting your playback handling code.

2. **Swift Requirement**: Version 3.x requires Swift support in your iOS project. If you encounter build errors, ensure your project has Swift support enabled.

### Android Issues

1. **MinSdk Version**: Starting from 3.x, Android requires minSdk 24. Update your `android/build.gradle`:
   ```gradle
   minSdkVersion 24
   ```

2. **Kotlin Support**: Version 3.x requires Kotlin support. This should be automatically handled by React Native 0.60+.

## Need Help?

If you encounter issues during migration:

1. Check the [troubleshooting section](../README.md#troubleshooting) in the main README
2. Search for existing issues on [GitHub](https://github.com/hyochan/react-native-audio-recorder-player/issues)
3. Create a new issue with details about your migration problem