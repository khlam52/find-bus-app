//
//  NSData+SAROM.h
//  iOS-SAROM

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSData(SAROM)
+(nullable instancetype)dataFromSecureAppROMItem:(NSString *)name NS_SWIFT_NAME(init(secureAppROMItem:));
@end

NS_ASSUME_NONNULL_END
