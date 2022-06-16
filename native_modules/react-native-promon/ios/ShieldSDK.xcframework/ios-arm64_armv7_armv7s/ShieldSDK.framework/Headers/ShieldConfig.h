#import <Foundation/Foundation.h>


@protocol ShieldConfigUpdateCallbacks <NSObject>

@optional

/** Called whenever a new configuration update has been successfully
 * downloaded.
 *
 * This does not necessarily mean the new configuration is active yet.
 *
 * 'timestamp' is the internal timestamp value of the configuration
 * update. As described in the general documentation for updateable
 * configuration, this timestamp is used by Shield to ensure that
 * Shield will always use the newest configuration that is available.
 * This also means that the timestamp to some extent behaves as a
 * unique identifier for the configuration update.
 *
 * This callback may be called on an arbitrary thread.
 */
- (void)configUpdateReceived:(NSString *)timestamp;

/* Some other callbacks we may add if there's a need for it:
 * - new update has been requested
 * - update request failed
 *   - server unavailable
 *   - no new update available
 *   - invalid update received
 * - new update has become the active configuration
 */

@end


__attribute__((visibility("default")))
@interface ShieldConfig: NSObject

/** Get the internal timestamp value of the currently active
 * configuration.
 *
 * The internal timestamp value is used by Shield to ensure Shield is
 * always using the newest available configuration. Thus the timestamp
 * also to some extent behaves as a unique identifier for the
 * configuration.
 *
 * NOTE: It is possible that an update with a newer timestamp has been
 * downloaded, but is not yet active.
 */
+ (NSString *)getActiveConfigTimestamp;

/** Make Shield try to download a configuration update.
 *
 * This will make Shield immediately try to obtain a configuration
 * update from the configured update server. Normally Shield will
 * automatically try to download updates at regular intervals, so this
 * method should only be called when the app has outside knowledge
 * that a new update could be available.
 *
 * This is currently only going to work if the app has not tried
 * downloading an update in the last couple of minutes. We should
 * probably change that.
 */
+ (void)requestUpdate;

/** Set the custom id for configuration update requests.
 *
 * Whenever Shield requests a configuration update over HTTP/HTTPS,
 * the customId value will be passed along in the X-update-custom-id
 * HTTP header. By default, there is no custom id.
 *
 * Once this method is called, Shield will remember the custom id and
 * use it for all future updates. To clear the custom id, call this
 * method with a nil customId.
 *
 * NOTE: This value may be used in text-based protocols, so should
 * only contain values that are safe for text. This call will fail if
 * 'customId' contains any values outside of the printable ASCII range
 * (0x20-0x7e).
 */
+ (void)setUpdateCustomId:(NSData *)customId;

/** Set the object to receive callbacks from the updateable
 * configuration code.
 *
 * This method can only be called once. If the method is called a
 * second time, it will do nothing and return NO. (Note: in the
 * future, the second call may do something more drastic, maybe even
 * crashing).
 */
+ (BOOL)setUpdateCallbacks:(id <ShieldConfigUpdateCallbacks>)cb;

@end
