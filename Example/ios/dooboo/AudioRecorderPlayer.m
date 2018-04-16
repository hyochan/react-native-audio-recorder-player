//
//  AudioRecorderPlayer.m
//  dooboo
//
//  Created by dooboolab on 16/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "AudioRecorderPlayer.h"
#import <React/RCTLog.h>
#import <AVFoundation/AVFoundation.h>

@implementation AudioRecorderPlayer {
  NSURL *audioFileURL;
  AVAudioRecorder *audioRecorder;
  AVAudioPlayer *audioPlayer;
  NSTimer *timer;
}

- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag {
  NSLog(@"audioPlayerDidFinishPlaying");
  NSNumber *duration = [NSNumber numberWithDouble:audioPlayer.duration];

  // Send last event then finish it.
  [self sendEventWithName:@"rn-playback" body:@{
                                                @"duration" : [duration stringValue],
                                                @"current_position" : [duration stringValue],
                                               }
  ];
  if (timer != nil) {
    [timer invalidate];
    timer = nil;
  }
}

- (void)updateProgress:(NSTimer*) timer
{
  NSLog(@"updateProgress");
  NSNumber *duration = [NSNumber numberWithDouble:audioPlayer.duration];
  NSNumber *currentTime = [NSNumber numberWithDouble:audioPlayer.currentTime];
  
  NSDictionary *status = @{
                           @"duration" : [duration stringValue],
                           @"current_position" : [currentTime stringValue],
                           };
  
  [self sendEventWithName:@"rn-playback" body:status];
}

- (void)startTimer
{
  dispatch_async(dispatch_get_main_queue(), ^{
    timer = [NSTimer scheduledTimerWithTimeInterval:0.01
                                             target:self
                                           selector:@selector(updateProgress:)
                                           userInfo:nil
                                            repeats:YES];
  });
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"rn-playback"];
}

RCT_EXPORT_METHOD(startRecord:(NSString*)path
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  
  if ([path isEqualToString:@"DEFAULT"]) {
    audioFileURL = [NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingString:@"sound.m4a"]];
  } else {
    audioFileURL = [NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingString:path]];
  }

  NSDictionary *audioSettings = [NSDictionary dictionaryWithObjectsAndKeys:
                                 [NSNumber numberWithFloat:44100],AVSampleRateKey,
                                 [NSNumber numberWithInt: kAudioFormatAppleLossless],AVFormatIDKey,
                                 [NSNumber numberWithInt: 1],AVNumberOfChannelsKey,
                                 [NSNumber numberWithInt:AVAudioQualityMedium],AVEncoderAudioQualityKey,nil];

  audioRecorder = [[AVAudioRecorder alloc]
                        initWithURL:audioFileURL
                        settings:audioSettings
                        error:nil];
  
  [audioRecorder record];
  resolve(@"Recorder started.");
}

RCT_EXPORT_METHOD(stopRecord:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  [audioRecorder stop];
  resolve(@"stop record");
}

RCT_EXPORT_METHOD(startPlay:(NSString*)path
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  RCTLogInfo(@"startPlay %@", path);
  if ([path isEqualToString:@"DEFAULT"]) {
    audioFileURL = [NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingString:@"sound.m4a"]];
  } else {
    audioFileURL = [NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingString:path]];
  }
  
  audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:audioFileURL error:nil];
  audioPlayer.delegate = self;
  [audioPlayer play];
  
  [self startTimer];
  resolve(@"start play");
}

RCT_EXPORT_METHOD(stopPlay:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  [audioPlayer stop];
  if (timer != nil) {
    [timer invalidate];
    timer = nil;
  }
  resolve(@"stop play");
}

@end
