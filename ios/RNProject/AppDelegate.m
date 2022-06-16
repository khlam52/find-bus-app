#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <GoogleMaps/GoogleMaps.h>
#import "ReactNativeConfig.h"
#import <Firebase.h>
#import <React/RCTLinkingManager.h>
#import "PromonUtil.h"

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif
  
  if ([FIRApp defaultApp] == nil) {
      [FIRApp configure];
  }
  [GMSServices provideAPIKey:[ReactNativeConfig envFor:@"IOS_GOOGLE_MAPS_API_KEY"]];


  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"RNProject"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
       rootView.backgroundColor = [UIColor systemBackgroundColor];
   } else {
       rootView.backgroundColor = [UIColor whiteColor];
   }
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  bool isEnablePromon = [[ReactNativeConfig envFor:@"IS_ENABLE_PROMON"] boolValue];
  if (isEnablePromon) {
    [[PromonUtil getInstance]addObserver];
  }

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// disable 3rd party keyboard
-(BOOL)application:(UIApplication *)application shouldAllowExtensionPointIdentifier:(NSString *)extensionPointIdentifier
{

    if (extensionPointIdentifier == UIApplicationKeyboardExtensionPointIdentifier)
    {
        return NO;
    }

    return YES;
}

#pragma mark Universal Links
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

// disable app snapshot in app switcher
-(void)applicationDidBecomeActive:(UIApplication *)application{
  bool isDisableAppSwitcherPreview = [[ReactNativeConfig envFor:@"IS_DISABLE_APP_SWITCHER_PREVIEW"] boolValue];
  
  if (isDisableAppSwitcherPreview) {
    if(self.launchScreenController){
      [[self launchScreenController] dismissViewControllerAnimated:NO completion:nil];
    }
  }
}

-(void)applicationWillResignActive:(UIApplication *)application{
  
  bool isDisableAppSwitcherPreview = [[ReactNativeConfig envFor:@"IS_DISABLE_APP_SWITCHER_PREVIEW"] boolValue];

  if (isDisableAppSwitcherPreview) {
    if(self.launchScreenController){
      [[self launchScreenController] dismissViewControllerAnimated:NO completion:nil];
    }
    
    self.launchScreenStoryboard = [UIStoryboard storyboardWithName:
                               @"LaunchScreen" bundle:[NSBundle mainBundle]];

    self.launchScreenController = [self.launchScreenStoryboard instantiateViewControllerWithIdentifier:@"launchScreenContoller"];

    if (@available(iOS 13.0, *)) {
         [self.launchScreenController setModalPresentationStyle: UIModalPresentationFullScreen];
     }
    [self.window.rootViewController presentViewController:self.launchScreenController animated:NO completion:nil];
  }


}

@end
