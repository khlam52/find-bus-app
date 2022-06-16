//
//  ShieldCallbackManager.h
//  ShieldSDK
//
//  Copyright (c) 2012 Promon AS. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "ShieldCallback.h"

@interface ShieldCallbackManager : NSObject
 
 // This method registers an observer that will be informed when Shield performs
 // security checks.
+ (void)setObserver: (id<ShieldCallback>) observer;

 // This method removes a registered observer.
+ (void)removeObserver;
 
@end
