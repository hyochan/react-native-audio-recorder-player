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

  s.pod_target_xcconfig = {
    "DEFINES_MODULE" => "YES",
    "SWIFT_VERSION" => "5.0",
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++20"
  }
  
  s.compiler_flags = folly_compiler_flags

  s.dependency 'React-Core'
  s.dependency 'React-jsi'
  s.dependency 'React-callinvoker'

  load 'nitrogen/generated/ios/AudioRecorderPlayer+autolinking.rb'
  add_nitrogen_files(s)

  s.info_plist = {
    'NSMicrophoneUsageDescription' => 'This app needs access to microphone to record audio.'
  }

  install_modules_dependencies(s)
end
