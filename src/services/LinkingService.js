import dynamicLinks from '@react-native-firebase/dynamic-links';
import { Linking } from 'react-native';

import { UNIVERSAL_LINK } from '~src/config/Config';

//https://rnprojdev.page.link/?link=https%3A%2F%2Finvertase%2Eio%2F%3Fname%3Dken&utm_campaign=banner

let unsubscribeFirebase;
let linkingSubscription;

const generateLink = async (param, value) => {
  const link = await dynamicLinks().buildLink({
    link: `https://invertase.io/?${param}=${value}`,
    // domainUriPrefix is created in your Firebase console
    domainUriPrefix: 'https://rnprojdev.page.link',
    // optional setup which updates Firebase analytics campaign
    // "banner". This also needs setting up before hand
    analytics: {
      campaign: 'banner',
    },
  });

  return link;
};

const handleLink = (url) => {
  // Handle dynamic link inside your own application
  if (url) {
    const decodeUrl = decodeURI(url);
    console.log('LinkingService -> handleLink -> decodeUrl: ', decodeUrl);
    let urlSeparatedArray = decodeUrl.split('?');
    let separatedUrl = urlSeparatedArray[0];
    let paramJson = {};
    if (urlSeparatedArray.length > 1) {
      let paramString = urlSeparatedArray[1];
      let separatedParams = paramString.split('&');
      for (let index = 0; index < separatedParams.length; index++) {
        const eachKeyValue = separatedParams[index];
        let key = eachKeyValue.split('=')[0];
        let value = eachKeyValue.split('=')[1];
        paramJson[key] = value;
      }
    }

    console.log('LinkingService -> handleLink -> separatedUrl: ', separatedUrl);
    console.log('LinkingService -> handleLink -> paramJson: ', paramJson);

    // check if the url needed to be handled
    if (separatedUrl === UNIVERSAL_LINK) {
      // ...navigate to your screen
    }
  }
};
// handle link click when app in foreground
const handleLinksInForeground = async () => {
  console.log('LinkingService -> handleLinksInForeground');
  unsubscribeFirebase = dynamicLinks().onLink((link) => {
    if (link && link.url) {
      console.log(
        'LinkingService -> handleLinksInForeground for dynamic links',
      );
      handleLink(link.url);
    }
  });

  // Listen to incoming links from deep linking
  linkingSubscription = Linking.addEventListener('url', (link) => {
    if (link && link.url) {
      console.log(
        'LinkingService -> handleLinksInForeground for universal links',
      );
      handleLink(link.url);
    }
  });
};

// handle link click when app in background/quit state
const handleLinksInQuit = async () => {
  console.log('LinkingService -> handleLinksInQuit');
  const initialLink = await dynamicLinks().getInitialLink();
  let urlToBeHandle = '';
  if (initialLink && initialLink.url) {
    console.log('LinkingService -> handleLinksInQuit for dynamic links');
    urlToBeHandle = initialLink.url;
  }
  // As a fallback, you may want to do the default deep link handling
  else {
    // will always return null if it is debugging with chrome
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      console.log('LinkingService -> handleLinksInQuit for universal links');
      urlToBeHandle = initialUrl;
    }
  }

  if (urlToBeHandle) {
    handleLink(urlToBeHandle);
  }
};

const init = () => {
  console.log('LinkingService -> init');
  handleLinksInForeground();
  handleLinksInQuit();
};

const unsubscribe = () => {
  console.log('LinkingService -> unsubscribe');
  if (unsubscribeFirebase) {
    unsubscribeFirebase();
  }
  if (linkingSubscription) {
    linkingSubscription.remove();
  }
};

export default { init, generateLink, unsubscribe };
