
Pod::Spec.new do |s|
  s.name         = "RNAudioRecorderPlayer"
  s.version      = "1.0.0"
  s.summary      = "RNAudioRecorderPlayer"
  s.description  = <<-DESC
                  RNAudioRecorderPlayer
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/author/RNAudioRecorderPlayer.git", :tag => "master" }
  s.source_files  = "RNAudioRecorderPlayer/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  