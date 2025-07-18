require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

Pod::Spec.new do |s|
  s.name         = "AudioRecorderPlayer"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "15.1" }
  s.source       = { :git => "https://github.com/hyochan/react-native-audio-recorder-player.git", :tag => "#{s.version}" }


  s.source_files = [
    "ios/**/*.{swift}",
    "ios/**/*.{m,mm}",
  ]
  
  s.exclude_files = [
    "ios/AudioRecorderPlayer-Bridging-Header.h",
  ]

  # Basic configuration - let Nitrogen handle the rest
  s.pod_target_xcconfig = {
    "SWIFT_VERSION" => "5.0",
    "SWIFT_ACTIVE_COMPILATION_CONDITIONS" => "$(inherited)",
    "GCC_PREPROCESSOR_DEFINITIONS" => "$(inherited) FOLLY_NO_CONFIG FOLLY_MOBILE=1 FOLLY_USE_LIBCPP=1",
  }
  
  s.compiler_flags = folly_compiler_flags

  s.dependency 'React-Core'
  s.dependency 'React-jsi'
  s.dependency 'React-callinvoker'

  load File.join(__dir__, 'nitrogen/generated/ios/AudioRecorderPlayer+autolinking.rb')
  add_nitrogen_files(s)

  s.info_plist = {
    'NSMicrophoneUsageDescription' => 'This app needs access to microphone to record audio.'
  }

  install_modules_dependencies(s)
end
