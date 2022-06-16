import EventEmitter from 'eventemitter3';

let eventEmitter = new EventEmitter();

function on(eventName, listener) {
  eventEmitter.on(eventName, listener);
}

function removeAllListenerByEventName(eventName) {
  eventEmitter.removeAllListeners(eventName);
}

function emit(event, payload, error = false) {
  console.log('CustomEventEmitter -> emit -> event:', event);
  eventEmitter.emit(event, payload, error);
}

function getEventEmitter() {
  return eventEmitter;
}

const EVENT_USER_LOGOUT = 'EVENT_USER_LOGOUT';
const EVENT_USER_LOGIN = 'EVENT_USER_LOGIN';

const EVENT_APP_IN_BACKGROUND = 'EVENT_APP_IN_BACKGROUND';
const EVENT_APP_IN_FOREGROUND = 'EVENT_APP_IN_FOREGROUND';
const EVENT_NAVIGATION_CONTAINER_IS_READY =
  'EVENT_NAVIGATION_CONTAINER_IS_READY';
const EVENT_CHECK_PUSH_IS_ENABLE = 'EVENT_CHECK_PUSH_IS_ENABLE';

export default {
  on,
  removeAllListenerByEventName,
  emit,
  getEventEmitter,
  EVENT_USER_LOGIN,
  EVENT_USER_LOGOUT,
  EVENT_APP_IN_BACKGROUND,
  EVENT_APP_IN_FOREGROUND,
  EVENT_NAVIGATION_CONTAINER_IS_READY,
  EVENT_CHECK_PUSH_IS_ENABLE,
};
