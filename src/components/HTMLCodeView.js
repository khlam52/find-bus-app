import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import useAppTheme from '~src/contexts/theme';
import CommonUtil from '~src/utils/CommonUtil';

const Css = require('json-to-css');

export default function HTMLCodeView({
  htmlBodyCode,
  forwardCustomHtmlStyle,
  ...props
}) {
  const insets = useSafeAreaInsets();
  const styles = getStyle(insets);
  const {
    theme: { settings: theme },
  } = useAppTheme();
  const [webViewContentHeight, setWebViewContentHeight] = useState(1);

  const scrollEnabled = props.scrollEnabled === false ? false : true;

  const customHtmlStyle = forwardCustomHtmlStyle
    ? Css.of(forwardCustomHtmlStyle)
    : '';

  const HTML_CODE_RESULT = getHTMLCodeFormat(htmlBodyCode);
  const js = `
  var links = document.getElementsByTagName('a');
  for (var i = 0; i < links.length; i++) {
      links[i].onclick = function (e) {
          e.preventDefault();
          window.ReactNativeWebView.postMessage(JSON.stringify({ openLink:e.currentTarget.getAttribute("href")}));
      }
  }

  setTimeout(function() { 
    window.ReactNativeWebView.postMessage(JSON.stringify({layoutHeight:document.documentElement.offsetHeight})); 
  }, 500);
  true; 

  `;

  const onMessage = (eve) => {
    let e = eve.nativeEvent.data || {};

    try {
      let obj = JSON.parse(e);
      // ---  Declare first load webview height
      if (
        obj.layoutHeight &&
        typeof obj.layoutHeight === 'number' &&
        scrollEnabled !== true
      ) {
        // setWebViewContentHeight(obj.layoutHeight + sh(theme.spacings.s2));
        setWebViewContentHeight(obj.layoutHeight);
      }
      // ---  Declare href open
      if (obj.openLink) {
        try {
          CommonUtil.openURL(obj.openLink);
        } catch (error) {
          console.log('HTMLCodeView -> onMessage -> openLink error:' + error);
        }
      }
    } catch (error) {
      console.log('HTMLCodeView -> onMessage -> error:' + error);
    }
  };

  function getHTMLCodeFormat(htmlCode) {
    let htmlStartTag =
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, user-scalable=0"><link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Lato" />';
    let htmlStyleTag = '<style>' + customHtmlStyle + '</style></head>';
    const htmlEndTag = '<body>' + htmlCode + '</body></html>';
    const htmlCodeResult = htmlStartTag + htmlStyleTag + htmlEndTag;
    return htmlCodeResult;
  }

  return (
    <View
      style={
        props.bodyViewStyle
          ? props.bodyViewStyle
          : { height: webViewContentHeight, flex: 1 }
      }>
      <WebView
        source={{
          html: HTML_CODE_RESULT,
        }}
        scrollEnabled={scrollEnabled}
        automaticallyAdjustContentInsets={true}
        injectedJavaScript={js}
        cacheEnabled={false}
        onMessage={onMessage}
        javaScriptEnabled={true}
        style={styles.webView}
      />
    </View>
  );
}
function getStyle(insets) {
  return StyleSheet.create({
    webView: { backgroundColor: 'transparent', flex: 1 },
  });
}
