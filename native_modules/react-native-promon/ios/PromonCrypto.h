#ifndef PromonCrypto_h
#define PromonCrypto_h


#endif /* PromonCrypto_h */

@interface PromonCrypto : NSObject

+(NSData*)getSAROMItemData:(NSString*)pathFromSaromFolder;
+(NSString*)getSAROMItemStr:(NSString*)pathFromSaromFolder;
+(void)setString:(NSString*)value forKey:(NSString*)key;
+(void)setData:(NSData*)data forKey:(NSString*)key;
+(NSString*)getStringForKey:(NSString*)key;
+(NSData*)getDataForKey:(NSString*)key;
+(void)removeDataForKey:(NSString*)key;

@end
