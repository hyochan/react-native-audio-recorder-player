//  RNAudioRecorderPlayer.m
//  dooboolab
//
//  Created by dooboolab on 16/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNAudioRecorderPlayer.h"
#import <React/RCTLog.h>
#import <AVFoundation/AVFoundation.h>

@implementation RNAudioRecorderPlayer {
  NSURL *audioFileURL;
  AVAudioRecorder *audioRecorder;
  AVAudioPlayer *audioPlayer;
  NSTimer *timer;
}

- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag {
  NSLog(@"audioPlayerDidFinishPlaying");
  NSNumber *duration = [NSNumber numberWithDouble:audioPlayer.duration * 1000];

  // Send last event then finish it.
  [self sendEventWithName:@"rn-playback" body:@{
                                                @"duration" : [duration stringValue],
                                                @"current_position" : [duration stringValue],
                                                @"justFinished" : @"1",
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
  NSNumber *duration = [NSNumber numberWithDouble:audioPlayer.duration * 1000];
  NSNumber *currentTime = [NSNumber numberWithDouble:audioPlayer.currentTime * 1000];
  
  NSDictionary *status = @{
                           @"duration" : [duration stringValue],
                           @"current_position" : [currentTime stringValue],
                           };
  
  [self sendEventWithName:@"rn-playback" body:status];
}

- (void)startTimer
{
  dispatch_async(dispatch_get_main_queue(), ^{
      self->timer = [NSTimer scheduledTimerWithTimeInterval:1.0
                                           target:self
                                           selector:@selector(updateProgress:)
                                           userInfo:nil
                                           repeats:YES];
  });
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
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
                                 [NSNumber numberWithInt: 2],AVNumberOfChannelsKey,
                                 [NSNumber numberWithInt:AVAudioQualityMedium],AVEncoderAudioQualityKey,nil];

  // Setup audio session
  AVAudioSession *session = [AVAudioSession sharedInstance];
  [session setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];

  audioRecorder = [[AVAudioRecorder alloc]
                        initWithURL:audioFileURL
                        settings:audioSettings
                        error:nil];
  
  audioRecorder.delegate = self;
  [audioRecorder record];
    
  NSString *filePath = audioFileURL.absoluteString;
  resolve(filePath);
}

RCT_EXPORT_METHOD(stopRecord:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    if (audioRecorder) {
        [audioRecorder stop];

        AVAudioSession *audioSession = [AVAudioSession sharedInstance];
        [audioSession setActive:NO error:nil];

        NSString *filePath = audioFileURL.absoluteString;
        resolve(filePath);
    } else {
        reject(@"audioRecorder record", @"audioRecorder is not set", nil);
    }
}

RCT_EXPORT_METHOD(startPlay:(NSString*)path
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    RCTLogInfo(@"startPlay %@", path);

    if ([[path substringToIndex:4] isEqualToString:@"http"]) {
        audioFileURL = [NSURL URLWithString:path];

        NSURLSessionDataTask *downloadTask = [[NSURLSession sharedSession]
        dataTaskWithURL:audioFileURL completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            // NSData *data = [NSData dataWithContentsOfURL:audioFileURL];
            if (!audioPlayer) {
                audioPlayer = [[AVAudioPlayer alloc] initWithData:data error:nil];
                audioPlayer.delegate = self;
            }
            

            [audioPlayer play];
            [self startTimer];
            NSString *filePath = audioFileURL.absoluteString;
            resolve(filePath);
        }];

        [downloadTask resume];
    } else {
        if ([path isEqualToString:@"DEFAULT"]) {
            audioFileURL = [NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingString:@"sound.m4a"]];
        } else {
            audioFileURL = [NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingString:path]];
        }

        if (!audioPlayer) {
            RCTLogInfo(@"audio player alloc");
            audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:audioFileURL error:nil];
            audioPlayer.delegate = self;
        }

        [audioPlayer play];
        [self startTimer];

        NSString *filePath = audioFileURL.absoluteString;
        resolve(filePath);
    }
}

RCT_EXPORT_METHOD(resume: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    if (!audioFileURL) {
        reject(@"audioRecorder play", @"no audioFileURL", nil);
        return;
    }

    if (!audioPlayer) {
        reject(@"audioRecorder play", @"no audioPlayer", nil);
        return;
    }

    [audioPlayer play];
    [self startTimer];
    NSString *filePath = audioFileURL.absoluteString;
    resolve(filePath);
}

RCT_EXPORT_METHOD(seekTo: (nonnull NSNumber*) time
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    if (audioPlayer) {
        audioPlayer.currentTime = [time doubleValue];
    } else {
        reject(@"audioPlayer seekTo", @"audioPlayer is not set", nil);
    }
}

RCT_EXPORT_METHOD(pausePlay: (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    RCTLogInfo(@"pause");
    if (audioPlayer && [audioPlayer isPlaying]) {
        [audioPlayer pause];
        if (timer != nil) {
            [timer invalidate];
            timer = nil;
        } 
        resolve(@"pause play");
    } else {
        reject(@"audioPlayer pause", @"audioPlayer is not playing", nil);
    }
}


RCT_EXPORT_METHOD(stopPlay:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    if (audioPlayer) {
        if (timer != nil) {
            [timer invalidate];
            timer = nil;
        }
        [audioPlayer stop];
        audioPlayer = nil;
        resolve(@"stop play");
    } else {
        reject(@"audioPlayer stop", @"audioPlayer is not set", nil);
    }
}

@end
