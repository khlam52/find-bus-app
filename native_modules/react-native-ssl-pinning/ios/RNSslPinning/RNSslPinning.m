//
//  RNNativeFetch.m
//  medipass
//
//  Created by Max Toyberman on 13/10/16.
//  Copyright © 2016 Localz. All rights reserved.
//

#import "RNSslPinning.h"
#import "AFNetworking.h"

@interface RNSslPinning()

@property (nonatomic, strong) NSURLSessionConfiguration *sessionConfig;
@property (nonatomic, strong) AFSecurityPolicy * policy;
@property (nonatomic, strong) AFURLSessionManager * uploadManager;
@property (nonatomic, assign) UIBackgroundTaskIdentifier backgroundUpdateTask;

@end

@implementation RNSslPinning
RCT_EXPORT_MODULE();

- (instancetype)init {
    self = [super init];
    if (self) {
        self.sessionConfig = [NSURLSessionConfiguration ephemeralSessionConfiguration];
        self.sessionConfig.HTTPCookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
        [self setCertPinningMode:@"pinned"];
    }
    return self;
}

RCT_EXPORT_METHOD(getCookies:(NSURL *)url resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSHTTPCookie *cookie;
    NSHTTPCookieStorage* cookieJar  =  NSHTTPCookieStorage.sharedHTTPCookieStorage;
    
    NSMutableDictionary* dictionary = @{}.mutableCopy;
    
    for (cookie in [cookieJar cookiesForURL:url]) {
        [dictionary setObject:cookie.value forKey:cookie.name];
    }
    
    if ([dictionary count] > 0) {
        resolve(dictionary);
    } else {
        NSError *error = nil;
        reject(@"no_cookies", @"There were no cookies", error);
    }
}

RCT_EXPORT_METHOD(removeCookieByName: (NSString *)cookieName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSHTTPCookieStorage *cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    for (NSHTTPCookie *cookie in cookieStorage.cookies) {
        // [cookieStorage deleteCookie:each];
        NSString * name = cookie.name;
        
        if([cookieName isEqualToString:name]) {
            [cookieStorage deleteCookie:cookie];
        }
    }
    
    resolve(nil);
}

RCT_EXPORT_METHOD(fetch:(NSString *)url obj:(NSDictionary *)obj callback:(RCTResponseSenderBlock)callback) {
    NSURL *u = [NSURL URLWithString:url];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:u];
    
    BOOL isFileUpload = NO;
    if (obj[@"isFileUpload"]) {
        isFileUpload = [obj[@"isFileUpload"]boolValue];
    }
    
    if (obj[@"certPinningMode"]) {
        [self setCertPinningMode:obj[@"certPinningMode"]];
    }
    AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
    [manager setSecurityPolicy:self.policy];
    [manager setResponseSerializer:[AFHTTPResponseSerializer serializer]];
    
    if (obj[@"clientCertPinningMode"] && obj[@"clientCertName"] && obj[@"clientCertPw"]) {
        if ([obj[@"clientCertPinningMode"] isEqualToString:@"pinned"]) {
            manager = [self setClientCertificateAuth:manager withCertFileName:obj[@"clientCertName"] withPassword:obj[@"clientCertPw"]];
        }
    }
    
    if (obj[@"method"]) {
        [request setHTTPMethod:obj[@"method"]];
    }
    if (obj[@"timeoutInterval"]) {
        [request setTimeoutInterval:[obj[@"timeoutInterval"] doubleValue] / 1000];
    }
    
    if(obj[@"headers"]) {
        [self setHeaders:obj request:request];
    }
    
    if (obj) {
        if ([obj objectForKey:@"body"]) {
            // this is a multipart form data request
            if (isFileUpload) {
                // post multipart
                [self performMultipartRequest:manager obj:obj url:url request:request callback:callback bodyString:obj[@"body"]];
            } else {
                // post a string

                NSString * contentType =[obj[@"headers"] objectForKey:@"content-type"];
                if (contentType && [contentType rangeOfString:@"x-www-form-urlencoded"].location != NSNotFound) {
                    NSError *e = nil;
                    NSString *jsonString = [obj objectForKey:@"body"];
                    NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
                    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData: data options:  NSJSONReadingMutableContainers error: &e];
                    
                    NSString *post = @"";
                    for (NSString *key in dict.allKeys) {
                        post = [NSString stringWithFormat:@"%@%@=%@&", post, key, [dict objectForKey:key]];
                    }
                    
                    NSData *postData = [post dataUsingEncoding:NSUTF8StringEncoding allowLossyConversion:YES];
                    [request setHTTPBody:postData];
                }
                else{
                    NSData *data = [obj[@"body"] dataUsingEncoding:NSUTF8StringEncoding];
                    [request setHTTPBody:data];
                }
            
                
                [self performRequest:manager obj:obj request:request callback:callback];
            }
        } else {
            [self performRequest:manager obj:obj request:request callback:callback];
        }
    }
}


- (void)performRequest:(AFURLSessionManager*)manager obj:(NSDictionary *)obj request:(NSMutableURLRequest*)request callback:(RCTResponseSenderBlock)callback  {
    [[manager dataTaskWithRequest:request uploadProgress:nil downloadProgress:nil completionHandler:^(NSURLResponse * _Nonnull response, id  _Nullable responseObject, NSError * _Nullable error) {
        
        NSHTTPURLResponse *httpResp = (NSHTTPURLResponse*) response;
        NSString *bodyString = [[NSString alloc] initWithData: responseObject encoding:NSUTF8StringEncoding];
        NSInteger statusCode = httpResp.statusCode;
        
        if (!error) {
            NSString *responseType = obj[@"responseType"];
            
            if ([responseType isEqualToString:@"base64"]) {
                NSString *base64String = [responseObject base64EncodedStringWithOptions:0];
                callback(@[[NSNull null], @{@"status": @(statusCode),
                                            @"headers": httpResp.allHeaderFields,
                                            @"data": base64String}]);
            } else {
                callback(@[[NSNull null], @{@"status": @(statusCode),
                                            @"headers": httpResp.allHeaderFields,
                                            @"bodyString": bodyString ? bodyString : @""}]);
            }
        } else if (error && error.userInfo[AFNetworkingOperationFailingURLResponseDataErrorKey]) {
            dispatch_async(dispatch_get_main_queue(), ^{
                callback(@[@{@"status": @(statusCode),
                             @"headers": httpResp.allHeaderFields,
                             @"bodyString": bodyString ? bodyString : @""}, [NSNull null]]);
            });
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                callback(@[@{@"status": [self getStatusCode:error],
                             @"error":[error localizedDescription]}, [NSNull null]]);
            });
        }
    }] resume];
    
}

- (void)setHeaders:(NSDictionary *)obj request:(NSMutableURLRequest*)request {
    if (obj[@"headers"] && [obj[@"headers"] isKindOfClass:[NSDictionary class]]) {
        NSMutableDictionary *m = [obj[@"headers"] mutableCopy];
        for (NSString *key in [m allKeys]) {
            if (![m[key] isKindOfClass:[NSString class]]) {
                m[key] = [m[key] stringValue];
            }
        }
        [request setAllHTTPHeaderFields:m];
    }
}

- (void)performMultipartRequest:(AFURLSessionManager*)manager obj:(NSDictionary *)obj url:(NSString *)url request:(NSMutableURLRequest*) request callback:(RCTResponseSenderBlock) callback bodyString:(NSString*)bodyString {
    
    NSMutableData *body = [NSMutableData data];
    [body appendData:[bodyString dataUsingEncoding:NSUTF8StringEncoding]];
    
    NSString *uploadFilePath = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0] stringByAppendingPathComponent:@"IDV"];
    [body writeToFile:uploadFilePath atomically:YES];
    [request setHTTPBodyStream:[NSInputStream inputStreamWithData:body]];
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        self.backgroundUpdateTask = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
            [self endBackgroundUploadTask];
        }];
        
        NSURLSessionUploadTask *uploadTask;
        uploadTask = [manager uploadTaskWithRequest:request
                                           fromFile:[NSURL fileURLWithPath:uploadFilePath]
                                           progress:^(NSProgress * _Nonnull uploadProgress) {
            NSLog(@"RNSslPinning -> performMultipartRequest -> progress is %@", uploadProgress.localizedDescription);
        }
                                  completionHandler:^(NSURLResponse * _Nonnull response, id  _Nullable responseObject, NSError * _Nullable error) {
            NSLog(@"RNSslPinning -> performMultipartRequest -> uploadTaskWithRequest -> completionHandler");
            
            [self endBackgroundUploadTask];
            
            NSError *removeFileError = nil;
            if (uploadFilePath != nil) {
                [[NSFileManager defaultManager] removeItemAtPath:uploadFilePath error:&removeFileError];
            }
            NSHTTPURLResponse *httpResp = (NSHTTPURLResponse*) response;
            NSString *bodyString = [[NSString alloc] initWithData: responseObject encoding:NSUTF8StringEncoding];
            NSInteger statusCode = httpResp.statusCode;
            if (!error) {
                NSString * responseType = obj[@"responseType"];
                
                if ([responseType isEqualToString:@"base64"]){
                    NSString *base64String = [responseObject base64EncodedStringWithOptions:0];
                    callback(@[[NSNull null], @{@"status": @(statusCode),
                                                @"headers": httpResp.allHeaderFields,
                                                @"data": base64String}]);
                } else {
                    callback(@[[NSNull null], @{@"status": @(statusCode),
                                                @"headers": httpResp.allHeaderFields,
                                                @"bodyString": bodyString ? bodyString : @""}]);
                }
            } else if (error && error.userInfo[AFNetworkingOperationFailingURLResponseDataErrorKey]) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    callback(@[@{@"status": @(statusCode),
                                 @"headers": httpResp.allHeaderFields,
                                 @"bodyString": bodyString ? bodyString : @""}, [NSNull null]]);
                });
            } else {
                dispatch_async(dispatch_get_main_queue(), ^{
                    callback(@[@{@"status": [self getStatusCode:error],
                                 @"error": [error localizedDescription]}, [NSNull null]]);
                });
            }
        }];
        
        [uploadTask resume];
    });
}

- (void)beginBackgroundUploadTask {
    _backgroundUpdateTask = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:^{
        [self endBackgroundUploadTask];
    }];
}

- (void)endBackgroundUploadTask {
    [[UIApplication sharedApplication] endBackgroundTask:_backgroundUpdateTask];
    _backgroundUpdateTask = UIBackgroundTaskInvalid;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (NSNumber*)getStatusCode:(NSError*)error {
    switch ([error code]) {
        case -1001:
            // timeout
            return [NSNumber numberWithInt:-4];
        case -1002:
            // unsupported URL
            return [NSNumber numberWithInt:-5];
        case -1003:
            // server not found
            return [NSNumber numberWithInt:-3];
        case -1009:
            // no connection
            return [NSNumber numberWithInt:-6];
        case -1200: // secure connection failed
        case -1201: // certificate has bad date
        case -1202: // certificate untrusted
        case -1203: // certificate has unknown root
        case -1204: // certificate is not yet valid
            // configuring SSL failed
            return [NSNumber numberWithInt:-2];
        default:
            return [NSNumber numberWithInt:-1];
    }
}

- (void)setCertPinningMode:(NSString *)certPinningMode {
    if ([certPinningMode isEqualToString:@"none"]) {
        self.policy = [AFSecurityPolicy policyWithPinningMode:AFSSLPinningModeNone];
        self.policy.allowInvalidCertificates = YES;
        self.policy.validatesDomainName = NO;
    } else if ([certPinningMode isEqualToString:@"pinned"]) {
        self.policy = [AFSecurityPolicy policyWithPinningMode:AFSSLPinningModeCertificate];
        self.policy.allowInvalidCertificates = NO;
        self.policy.validatesDomainName = YES;
    }
}

- (AFURLSessionManager *)setClientCertificateAuth:(AFURLSessionManager *)manager withCertFileName:(NSString *)clientCertNameString withPassword:(NSString *)certPasswordString {
    __weak typeof(self)weakSelf = self;
    __weak AFURLSessionManager *_manager = manager;
    
    [_manager setSessionDidReceiveAuthenticationChallengeBlock:^NSURLSessionAuthChallengeDisposition(NSURLSession*session, NSURLAuthenticationChallenge *challenge, NSURLCredential *__autoreleasing*_credential) {
        NSURLSessionAuthChallengeDisposition disposition = NSURLSessionAuthChallengePerformDefaultHandling;
        __autoreleasing NSURLCredential *credential =nil;
        
        if([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
            if([_manager.securityPolicy evaluateServerTrust:challenge.protectionSpace.serverTrust forDomain:challenge.protectionSpace.host]) {
                credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
                if(credential) {
                    disposition = NSURLSessionAuthChallengeUseCredential;
                } else {
                    disposition = NSURLSessionAuthChallengePerformDefaultHandling;
                }
            } else {
                disposition = NSURLSessionAuthChallengeCancelAuthenticationChallenge;
            }
        } else {
            SecIdentityRef identity = NULL;
            SecTrustRef trust = NULL;
            NSString *p12Str = [[NSBundle mainBundle] pathForResource:clientCertNameString ofType:@"p12"];
            NSData *PKCS12Data = [NSData dataWithContentsOfFile:p12Str];
            if ([[weakSelf class] extractIdentity:&identity andTrust:&trust fromPKCS12Data:PKCS12Data withPassword:certPasswordString]){
                SecCertificateRef caRef = SecCertificateCreateWithData(NULL, (__bridge CFDataRef)PKCS12Data);
                
                SecIdentityCopyCertificate(identity, &caRef);
                
                const void *certs[] = {caRef};
                CFArrayRef certArray = CFArrayCreate(kCFAllocatorDefault, certs,1,NULL);
                credential = [NSURLCredential credentialWithIdentity:identity certificates:(__bridge  NSArray*)certArray persistence:NSURLCredentialPersistencePermanent];
                disposition = NSURLSessionAuthChallengeUseCredential;
            }
        }
        *_credential = credential;
        return disposition;
    }];
    
    return _manager;
}

+ (BOOL)extractIdentity:(SecIdentityRef*)outIdentity andTrust:(SecTrustRef *)outTrust fromPKCS12Data:(NSData *)inPKCS12Data withPassword:(NSString *)certPasswordString {
    OSStatus securityError = errSecSuccess;
    //client certificate password
    NSDictionary *optionsDictionary = [NSDictionary dictionaryWithObject:certPasswordString
                                                                  forKey:(__bridge id)kSecImportExportPassphrase];
    
    CFArrayRef items = CFArrayCreate(NULL, 0, 0, NULL);
    securityError = SecPKCS12Import((__bridge CFDataRef)inPKCS12Data,(__bridge CFDictionaryRef)optionsDictionary,&items);
    
    if (securityError == 0) {
        CFDictionaryRef myIdentityAndTrust =CFArrayGetValueAtIndex(items,0);
        const void *tempIdentity = NULL;
        tempIdentity= CFDictionaryGetValue (myIdentityAndTrust,kSecImportItemIdentity);
        *outIdentity = (SecIdentityRef)tempIdentity;
        const void *tempTrust = NULL;
        tempTrust = CFDictionaryGetValue(myIdentityAndTrust,kSecImportItemTrust);
        *outTrust = (SecTrustRef)tempTrust;
    } else {
        NSLog(@"Failed with error code %d",(int)securityError);
        return NO;
    }
    return YES;
}

RCT_EXPORT_METHOD(cancelAllUpload) {
    NSLog(@"RNSslPinning -> cancelAllUpload");
    [_uploadManager.session invalidateAndCancel];
    [_uploadManager.session getTasksWithCompletionHandler:^(NSArray<NSURLSessionDataTask *> * _Nonnull dataTasks, NSArray<NSURLSessionUploadTask *> * _Nonnull uploadTasks, NSArray<NSURLSessionDownloadTask *> * _Nonnull downloadTasks) {
        if (uploadTasks) {
            for (NSURLSessionUploadTask * uploadTask in uploadTasks) {
                [uploadTask cancel];
            }
        }
    }];
    _uploadManager = nil;
}

@end
