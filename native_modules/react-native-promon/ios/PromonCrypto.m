#import <Foundation/Foundation.h>
#import "PromonCrypto.h"
#import <Shield.h>

@implementation PromonCrypto

#pragma mark - SAROM

+(NSData*)getSAROMItemData:(NSString*)pathFromSaromFolder{
    return [NSData dataFromSecureAppROMItem: pathFromSaromFolder];
}

+(NSString*)getSAROMItemStr:(NSString*)pathFromSaromFolder{
    NSData* saromItemData = [PromonCrypto getSAROMItemData: pathFromSaromFolder];
    if (saromItemData){
        NSString* saromItemString = [[NSString alloc] initWithData:saromItemData encoding:NSUTF8StringEncoding];
        return saromItemString;
    }
    return @"";
}

#pragma mark - Secure local storage
+(void)setString:(NSString*)value forKey:(NSString*)key{
    if (value) {
        NSData *dataToStore = [value dataUsingEncoding:NSUTF8StringEncoding];
        [PromonCrypto setData:dataToStore forKey: key];
    }
}

+(void)setData:(NSData*)data forKey:(NSString*)key{
    if(data && key){
        SecureLocalStorage *storage = [SecureLocalStorage defaultStorage];
        
        NSError *error = nil;
        if (![storage setValue:data forKey:key error:&error]) {
            NSLog(@"PromonCrypto -> setData -> fail");
        }
    }
        
}

+(NSString*)getStringForKey:(NSString*)key{
    NSData *dataRetrieved = [PromonCrypto getDataForKey:key];
    if (dataRetrieved) {
        NSString* convertedStr = [[NSString alloc] initWithData:dataRetrieved encoding:NSUTF8StringEncoding];
        return convertedStr;
    }
    return @"";
}

+(NSData*)getDataForKey:(NSString*)key{
    if(key){
        SecureLocalStorage *storage = [SecureLocalStorage defaultStorage];
        NSError *error = nil;
        NSData *dataRetrieved = [storage valueForKey:key error:&error];
        
        if (dataRetrieved == nil) {
            NSLog(@"PromonCrypto -> getDataForKey -> fail");
            return nil;
        }
        else{
            return dataRetrieved;
        }
        
    }
    return nil;
}

+(void)removeDataForKey:(NSString*)key{
    if (key) {
        SecureLocalStorage *storage = [SecureLocalStorage defaultStorage];
        NSError *error = nil;
        [storage removeObjectForKey:key error:&error];
    }
}



@end
