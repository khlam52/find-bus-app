#import <Foundation/Foundation.h>

__attribute__((visibility("default")))
@interface SecureLocalStorage : NSObject

extern NSErrorDomain const ShieldSLSErrorDomain;
NS_ERROR_ENUM(ShieldSLSErrorDomain) {
    ItemNotFound = 0
};

+ (SecureLocalStorage*) defaultStorage;

- (instancetype)init;
- (NSData *) valueForKey: (NSString *)key
                   error: (NSError  * __autoreleasing *)err;
- (BOOL) setValue: (NSData   *)data
           forKey: (NSString *)key
            error: (NSError  * __autoreleasing *)err;
- (BOOL) removeObjectForKey: (NSString *)key
                      error: (NSError  * __autoreleasing *)err;

@end
