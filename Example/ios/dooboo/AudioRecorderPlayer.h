//
//  AudioRecorderPlayer.h
//  dooboo
//
//  Created by dooboolab on 16/04/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef AudioRecorderPlayer_h
#define AudioRecorderPlayer_h


#endif /* AudioRecorderPlayer_h */

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface AudioRecorderPlayer : RCTEventEmitter <RCTBridgeModule, AVAudioPlayerDelegate>
- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player
                       successfully:(BOOL)flag;
- (void)updateProgress:(NSTimer*) timer;
- (void)startTimer;
@end
