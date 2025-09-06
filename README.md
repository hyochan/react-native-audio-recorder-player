# react-native-audio-recorder-player

> ⚠️ **DEPRECATED**: This package is deprecated. Please use [react-native-nitro-sound](https://github.com/hyochan/react-native-nitro-sound) instead. Don't worry - it has the exact same API, so migration is seamless!

<img src="Logotype Primary.png" width="70%" alt="Logo" />

[![yarn Version](http://img.shields.io/npm/v/react-native-audio-recorder-player.svg?style=flat-square)](https://npmjs.org/package/react-native-audio-recorder-player)
[![Downloads](http://img.shields.io/npm/dm/react-native-audio-recorder-player.svg?style=flat-square)](https://npmjs.org/package/react-native-audio-recorder-player)
[![CI](https://github.com/hyochan/react-native-audio-recorder-player/actions/workflows/ci.yml/badge.svg)](https://github.com/hyochan/react-native-audio-recorder-player/actions/workflows/ci.yml)
[![publish-package](https://github.com/hyochan/react-native-audio-recorder-player/actions/workflows/publish-package.yml/badge.svg)](https://github.com/hyochan/react-native-audio-recorder-player/actions/workflows/publish-package.yml)
![License](http://img.shields.io/npm/l/react-native-audio-recorder-player.svg?style=flat-square)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![LICENSE](http://img.shields.io/npm/l/@react-native-seoul/masonry-list.svg?style=flat-square)](https://npmjs.org/package/@react-native-seoul/masonry-list)

## Migration to React Native Nitro Sound

This package has been deprecated in favor of [react-native-nitro-sound](https://github.com/hyochan/react-native-nitro-sound), which offers:

- ✅ **Same API** - No code changes required
- ⚡️ **Better Performance** - Optimized with latest Nitro architecture
- 🎯 **Active Maintenance** - Regular updates and bug fixes
- 📱 **Improved Platform Support** - Better iOS, Android, and Web compatibility

### How to Migrate

1. **Uninstall the old package:**

   ```sh
   yarn remove react-native-audio-recorder-player react-native-nitro-modules
   # or
   npm uninstall react-native-audio-recorder-player react-native-nitro-modules
   ```

2. **Install the new package:**

   ```sh
   yarn add react-native-nitro-sound
   # or
   npm install react-native-nitro-sound
   ```

3. **Update your imports:**

   ```typescript
   // Before
   import AudioRecorderPlayer from 'react-native-audio-recorder-player';

   // After
   import AudioRecorderPlayer from 'react-native-nitro-sound';
   ```

4. **That's it!** All your existing code will work without any changes.

### Need Help?

- 📖 [Full Documentation](https://github.com/hyochan/react-native-nitro-sound)
- 🐛 [Report Issues](https://github.com/hyochan/react-native-nitro-sound/issues)
- 💬 [Discussions](https://github.com/hyochan/react-native-nitro-sound/discussions)

## Why the Change?

The new `react-native-nitro-sound` package represents a complete rewrite with:

- Modern architecture for better performance
- Cleaner codebase that's easier to maintain
- Better error handling and debugging
- Improved TypeScript support
- More consistent behavior across platforms

Thank you for your support and understanding! 🙏
