//
//  ShieldCallback.h
//  ShieldSDK
//
//  Copyright (c) 2013 Promon AS. All rights reserved.
//

/*
 * This protocol is to be implemented by classes that want to
 * be notified about events provided by Promon Shield.
 */
@protocol ShieldCallback <NSObject>

@optional

// This method is called when the Shield SDK has determined whether the device that the application runs on is jailbroken.
- (void) jailbreakStatus: (int) jailbroken;

// This method is called when the Shield SDK has determined whether the host application was repackaged.
- (void) repackagingStatus: (int) repackaged;

// This method is called when the Shield SDK has determined whether the host application is being recorded.
- (void)screenRecordStatusChanged:(BOOL)isRecording;

// This method is called when the Shield SDK has determined whether a debugger is attached to the host application.
- (void) debuggerStatus: (int) debugged;

// This method is called when the Shield SDK discovers that a screenshot has been taken of the application.
- (void) screenshotDetected;

// This method is called when the user did not grant the Shield SDK access to the camera roll, which is required
// by the screenshot detection feature on iOS < 7.
- (void) noAccessToCameraRoll;

// This method is called when Shield has prevented an untrusted library from being injected into the
// application during runtime.
- (void) libraryInjectionPrevented;

// This method is called when Shield has detected that there are untrusted libraries in the process.
- (void) libraryInjectionDetected;

// This method is called when Shield has detected that there are hooking frameworks in the process.
- (void) hookingFrameworksDetected;

// This method is called to pass "unspecified" messages from Shield.
- (void) buildSpecificMessage: (int) type withData: (NSData*) msg;

@end
