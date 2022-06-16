#import "PromonUtil.h"
#import <ShieldSDK/Shield.h>

static NSString *const PROMONI01 = @"PMN-020"; // Jailbroken
static NSString *const PROMONI02 = @"PMN-021-02"; // REPACKAGING
static NSString *const PROMONI03 = @"PMN-021-03"; // DEBUGGER
static NSString *const PROMONI04 = @"PMN-021-04"; // screenshotDetected
static NSString *const PROMONI05 = @"PMN-021-05"; // noAccessToCameraRoll
static NSString *const PROMONI06 = @"PMN-021-06"; // libraryInjectionPrevented
static NSString *const PROMONI07 = @"PMN-021-07"; // libraryInjectionDetected
static NSString *const PROMONI08 = @"PMN-021-08"; // hookingFrameworksDetected
static NSString *const PROMONI09 = @"PMN-021-09"; // buildSpecificMessage

@interface PromonUtil()<ShieldCallback>
@end

@implementation PromonUtil
+ (id)getInstance{
    static PromonUtil *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
    });
    return instance;
}

-(void)addObserver{
    [ShieldCallbackManager setObserver:self];
}

#pragma mark Promon ShieldCallback
// This method is called when the Shield SDK has determined whether the device that the application runs on is jailbroken.
- (void) jailbreakStatus: (int) jailbroken{
    if (jailbroken) {
        [self showAlert:PROMONI01];
    }
}

// This method is called when the Shield SDK has determined whether the host application was repackaged.
- (void) repackagingStatus: (int) repackaged{
    if (repackaged){
        [self showAlert:PROMONI02];
    }
}

// This method is called when the Shield SDK has determined whether a debugger is attached to the host application.
- (void) debuggerStatus: (int) debugged{
    if (debugged){
        [self showAlert:PROMONI03];
    }
}

// This method is called when the Shield SDK discovers that a screenshot has been taken of the application.
- (void) screenshotDetected{
    [self showAlert:PROMONI04];
}

// This method is called when the user did not grant the Shield SDK access to the camera roll, which is required
// by the screenshot detection feature on iOS < 7.
- (void) noAccessToCameraRoll{
    //    PROMONI05
}

// This method is called when Shield has prevented an untrusted library from being injected into the
// application during runtime.
- (void) libraryInjectionPrevented{
    //    PROMONI06
}

// This method is called when Shield has detected that there are untrusted libraries in the process.
- (void) libraryInjectionDetected{
    [self showAlert:PROMONI07];
}

// This method is called when Shield has detected that there are hooking frameworks in the process.
- (void) hookingFrameworksDetected{
    [self showAlert:PROMONI08];
    
}

// This method is called to pass "unspecified" messages from Shield.
- (void) buildSpecificMessage: (int) type withData: (NSData*) msg{
    //    PROMONI09
}

- (void) showAlert : (NSString *) errorCode {
    dispatch_async(dispatch_get_global_queue( DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        //Background Thread
        dispatch_async(dispatch_get_main_queue(), ^(void){
            //Run UI Updates
            UIAlertController* alert = [UIAlertController alertControllerWithTitle:nil
                                                                           message:[NSString stringWithFormat:([errorCode isEqualToString:PROMONI01]) ? NSLocalizedString(@"jailbreak_alert", nil):NSLocalizedString(@"security_risk", nil),errorCode]
                                                                    preferredStyle:UIAlertControllerStyleAlert];
            
            UIAlertAction* defaultAction = [UIAlertAction
                                            actionWithTitle:NSLocalizedString(@"common_exit", nil)
                                            style:UIAlertActionStyleDefault
                                            handler:^(UIAlertAction * _Nonnull action) {
                exit(0);
            }];
            
            [alert addAction:defaultAction];
            
            [[[[UIApplication sharedApplication] keyWindow] rootViewController] presentViewController:alert animated:YES completion:nil];
        });
    });
}
@end
