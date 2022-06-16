
#import "RNCommonUtil.h"
#import <UserNotifications/UserNotifications.h>

@implementation RNCommonUtil

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(pushNoti:(NSDictionary *)dataDict) {
    UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
    [content setTitle:[dataDict objectForKey:@"title"]];
    [content setSubtitle:[dataDict objectForKey:@"subTitle"]];
    [content setBody:[dataDict objectForKey:@"body"]];
    [content setSound:[UNNotificationSound defaultSound]];
    [content setCategoryIdentifier:[dataDict objectForKey:@"pushChannel"]];
    
    UNNotificationRequest *notificationRequest = [UNNotificationRequest requestWithIdentifier:[dataDict objectForKey:@"pushChannel"]
                                                                                      content:content
                                                                                      trigger:nil];
    [[UNUserNotificationCenter currentNotificationCenter] addNotificationRequest:notificationRequest withCompletionHandler:^(NSError * _Nullable error) {
        if (error == nil) {
        }
    }];
}

RCT_EXPORT_METHOD(exitApp) {
    exit(0);
}

@end
  
