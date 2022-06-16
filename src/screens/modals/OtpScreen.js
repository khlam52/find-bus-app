import React, { useEffect, useRef, useState } from 'react';

import { useStoreState } from 'easy-peasy';
import I18n from 'i18n-js';
import _ from 'lodash';
import { SafeAreaView, StyleSheet, Text, View, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OTPTextView from 'react-native-otp-textinput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WarningIcon, CloseIcon } from '~src/assets/images';
import AppPressable from '~src/components/AppPressable';
import BaseHeader from '~src/components/BaseHeader';
import CountdownButton from '~src/components/CountdownButton';
import { OTP_FROM_TYPE, SERVER_TO_APP_LANG_MAP } from '~src/constants/Constant';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import { currentSessionID } from '~src/contexts/store/Store';
import useAppTheme from '~src/contexts/theme';
import Route from '~src/navigations/Route';
import ApiService from '~src/services/ApiService';
import { Colors, Typography } from '~src/styles';
import { sw, sh } from '~src/styles/Mixins';
import AlertHelper from '~src/utils/AlertHelper';
import ErrorUtil from '~src/utils/ErrorUtil';

export default function OtpScreen({ route, navigation }) {
  const TIMER_SECOND = 99;
  const MAX_TOTAL_INPUT_OTP_LIMIT = 4;
  const MAX_TOTAL_RESEND_OTP_LIMIT = 3;
  const { locale, setLocale, t } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();

  const {
    theme: { settings: theme },
  } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyle(insets, theme);

  const otpFromTypeRef = useRef(
    _.get(route, 'params.otpFromType', OTP_FROM_TYPE.NONE),
  );

  const [otpVal, setInputOTPVal] = useState('');
  const otpValResult = useRef('');

  const totalInputOTPRef = useRef(0);
  const totalResendOTPRef = useRef(0);

  const countdownBtnRef = useRef();
  const otpInputRef = useRef(null);
  const [isInputOTPEditable, setIsInputOTPEditable] = useState(true);

  const [isSubmitBtnDisable, setIsSubmitBtnDisable] = useState(true);

  const [maskPhoneNumber, setMaskPhoneNumber] = useState('');
  const [authReqId, setAuthReqId] = useState('');
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [errorMsgText, setErrorMsgText] = useState('');

  const [userInfoObj, setUserInfoObj] = useState(null);
  const userProfile = useStoreState((state) => state.user.userProfile);
  const responseState = useStoreState((state) => state.user.authorizeResponse);
  const passUserInfoRef = useRef(_.get(route, 'params.passUserInfo', null));

  const alertIcon = <WarningIcon width={sw(60)} height={sw(69)} />;

  useEffect(() => {
    console.log('OtpScreen -> useEffect');
    console.log(`route.params.otpFromType" ${route.params.otpFromType}`);
    // check if otpFromTypeRef.current is none, then handle error
    if (otpFromTypeRef.current === OTP_FROM_TYPE.NONE) {
      console.log(`route params: ${JSON.stringify(route)}`);
      console.log(`otpFromTypeRef.current === OTP_FROM_TYPE.NONE`);
      ErrorUtil.showApiErrorMsgAlert();
      return;
    }

    if (otpFromTypeRef.current === OTP_FROM_TYPE.FROM_USERNAME_PASSWORD_LOGIN) {
      console.log(`setUserInfoObj(passUserInfoRef.current);`);
      setUserInfoObj(passUserInfoRef.current);
    } else {
      console.log(`setUserInfoObj(userProfile);`);
      setUserInfoObj(userProfile);
    }

    generateSmsOtp();
    console.log(
      'OtpScreen -> useEffect -> authorizeResponseState: ',
      responseState,
    );
  }, []);

  const onBtnClosePressed = () => {
    const alertData = {};
    alertData.icon = <WarningIcon width={sw(60)} height={sw(69)} />;
    if (otpFromTypeRef.current === OTP_FROM_TYPE.FROM_USERNAME_PASSWORD_LOGIN) {
      navigation.navigate(Route.LOGIN_SCREEN);
      return;
    }

    let icon = <WarningIcon width={sw(60)} height={sw(69)} />;

    AlertHelper.showAlert(
      icon,
      alertData.title,
      alertData.content,
      t('BUTTONS.QUIT'),
      t('BUTTONS.BACK'),
      alertData.primaryAction,
    );
  };

  const handleVerifyOtpSuccess = async () => {
    if (otpFromTypeRef.current === OTP_FROM_TYPE.FROM_USERNAME_PASSWORD_LOGIN) {
      console.log(
        'OtpScreen -> handleVerifyOtpSuccess -> authorizeResponseState: ',
        responseState,
      );
      try {
        // await AuthService.login(false);
      } catch (err) {
        console.log(
          'OtpScreen -> handleVerifyOtpSuccess -> login -> error:',
          err,
        );
        hideLoading();
        ErrorUtil.showApiErrorMsgAlert(err, () => {
          navigation.goBack();
        });
      }
      hideLoading();
      // NavigationUtil.processLoginSequence(navigation);
    }
  };

  const onClickSubmitBtn = () => {
    Keyboard.dismiss();
    setShowErrorMsg(false);
    if (isMAXTotalInputOTPLimit()) {
      if (isMaxResendOtpLimit()) {
        AlertHelper.showAlertWithOneButton(
          alertIcon,
          t('ALERT.APP_TITLE'),
          t('ERROR.REACHED_5_OTP_ENTRIES_THIRD_OTP_REQUEST_MSG'),
          t('BUTTONS.QUIT'),
          () => {
            navigation.goBack();
          },
        );
      } else {
        countdownBtnRef.current.enableResend();
        AlertHelper.showAlertWithOneButton(
          alertIcon,
          t('ALERT.APP_TITLE'),
          t('ERROR.REACHED_5_OTP_ENTRIES_MSG'),
          t('BUTTONS.OK'),
          () => {},
        );
      }
    } else {
      otpInputRef.current.resetInputWithNoFocus();
      setIsSubmitBtnDisable(true);
      totalInputOTPRef.current += 1;
      console.log(
        `onClickSubmitBtn, totalInputOTPRef: ${totalInputOTPRef.current}`,
      );
      // Call API...
      verifySmsOtp();
    }
  };

  const onClickResendBtn = () => {
    setShowErrorMsg(false);
    if (!isMaxResendOtpLimit()) {
      generateSmsOtp();
    } else {
      countdownBtnRef.current.overResendLimit();
      AlertHelper.showAlertWithOneButton(
        alertIcon,
        t('ALERT.APP_TITLE'),
        t('ERROR.REACHED_3_OTP_REQUESTS_MSG'),
        t('BUTTONS.QUIT'),
        () => {
          navigation.goBack();
        },
      );
    }
  };

  const handleApiError = (error) => {
    const errorObj = ErrorUtil.getNonLoginApiDisplayError(error);
    let serverLocal = SERVER_TO_APP_LANG_MAP[I18n.locale];

    let displayErrorMsg = _.get(errorObj, serverLocal, '');
    if (
      errorObj.errorCode === 'MAIN-29056' ||
      errorObj.errorCode === 'MAIN-29057'
    ) {
      errorObj.isInline = true;
    }

    if (errorObj.isInline) {
      setShowErrorMsg(true);
      setErrorMsgText(errorObj.msg);
    } else {
      AlertHelper.showErrorAlertByErrorObj(errorObj);
    }
  };

  const verifySmsOtp = async () => {
    showLoading();
    try {
      if (!userInfoObj) throw 'userInfoObj null';
      if (!userInfoObj.usrId) throw 'userInfoObj.usrId null';
      console.log('otpVal:', otpVal);
      console.log('otpValResult:', otpValResult);
      let response;

      response = await ApiService.verifySmsOtp(
        authReqId,
        otpValResult.current,
        currentSessionID,
        userInfoObj.usrId,
      );

      console.log('OtpScreen -> verifySmsOtp -> response: ', response);
      if (response && response.status === 'Success') {
        countdownBtnRef.current.overResendLimit();
        handleVerifyOtpSuccess();
      } else {
        hideLoading();
        ErrorUtil.showApiErrorMsgAlert();
      }
    } catch (error) {
      console.log('OtpScreen -> verifySmsOtp -> error :', error);
      hideLoading();
      setTimeout(() => {
        Keyboard.dismiss();
        handleApiError(error);
      }, 100);
    }
  };

  const generateSmsOtp = async () => {
    showLoading();
    try {
      let response;

      response = await ApiService.getSmsOtp();

      if (response.status && response.status === 'Success') {
        setMaskPhoneNumber(response.mobileNumberMasked);
        setAuthReqId(response.authReqId);
        // Success Resend
        totalInputOTPRef.current = 0;
        totalResendOTPRef.current += 1;
        setTimeout(() => {
          Keyboard.dismiss();
          otpInputRef.current.clearInput();
          otpInputRef.current.focusFirst();
        }, 100);
      } else {
        countdownBtnRef.current.enableResend();
        ErrorUtil.showApiErrorMsgAlert();
      }
    } catch (error) {
      console.log('OtpScreen -> generateSmsOtp -> error :', error);
      // handleApiError(error);
      setTimeout(() => {
        Keyboard.dismiss();
        handleApiError(error);
      }, 100);
    }
    hideLoading();
  };

  const isMAXTotalInputOTPLimit = () => {
    return totalInputOTPRef.current >= MAX_TOTAL_INPUT_OTP_LIMIT;
  };

  const isMaxResendOtpLimit = () => {
    console.log(
      `check isMaxResendOtpLimit, totalResendOTPRef: ${totalResendOTPRef.current} >= ${MAX_TOTAL_RESEND_OTP_LIMIT}`,
    );
    return totalResendOTPRef.current >= MAX_TOTAL_RESEND_OTP_LIMIT;
  };

  const onInputOTP = (otpValue) => {
    console.log('OTPModal -> onInputOTP -> ' + otpValue);
    setInputOTPVal(otpValue);
    otpValResult.current = otpValue;
    if (otpValue.length === 6) {
      console.log('onInputOTP here1');
      setIsSubmitBtnDisable(false);
      onClickSubmitBtn(); // no need submit btn now
    } else {
      setIsSubmitBtnDisable(true);
    }
  };

  const showBtnCloseOrLogout = () => {
    if (otpFromTypeRef.current === OTP_FROM_TYPE.FROM_USERNAME_PASSWORD_LOGIN) {
      return (
        <Text onPress={onBtnClosePressed} style={styles.logoutText}>
          {t('BUTTONS.LOGOUT')}
        </Text>
      );
    } else {
      return (
        <AppPressable onPress={onBtnClosePressed}>
          <CloseIcon
            width={sw(16)}
            height={sw(16)}
            fill={theme.colors.text60}
          />
        </AppPressable>
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      scrollEnabled={false}>
      <BaseHeader
        title={''}
        rightElement={showBtnCloseOrLogout()}
        isTransparent={true}
      />
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.titleText}>{t('SCREENS.OTP_SCREEN.TITLE')}</Text>
        <Text style={styles.descText}>
          {locale === 'en'
            ? t('SCREENS.OTP_SCREEN.OTP_SENT') + '\n' + maskPhoneNumber
            : t('SCREENS.OTP_SCREEN.OTP_SENT') + maskPhoneNumber}
        </Text>
        {/* opt text view with dot */}
        <View style={styles.viewOtpOuterContainer}>
          <View style={styles.OTPInputContainer}>
            <OTPTextView
              ref={otpInputRef}
              handleTextChange={(text) => {
                onInputOTP(text);
              }}
              containerStyle={styles.textInputContainer}
              textContainerStyle={styles.roundedTextContainer}
              offTintColor={'#FFFFFF'}
              tintColor={Colors.opacity('#203C7C', 0.28)}
              inputCount={6}
              needMasked={false}
              kbType="numeric"
              dotViewStyle={styles.dotViewStyle}
              showDot={true}
              editable={isInputOTPEditable}
            />
          </View>
        </View>
        {showErrorMsg && (
          <Text style={styles.errorMsgText}>{errorMsgText}</Text>
        )}
        <Text style={styles.tipsText}>{t('SCREENS.OTP_SCREEN.TIPS')}</Text>
        <View style={styles.viewResendBtn}>
          <CountdownButton
            ref={countdownBtnRef}
            countDownSec={TIMER_SECOND}
            onPress={onClickResendBtn}
          />
        </View>
        {/* <View style={styles.viewSubmitBtn}>
          <AppButton
            onPress={onClickSubmitBtn}
            text={t('BUTTONS.NEXT')}
            paddingHorizontal={20}
            disabled={isSubmitBtnDisable}
          />
        </View> */}
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.underlayerLt,
    },
    safeAreaView: {
      flex: 1,
      marginHorizontal: sw(28),
    },
    viewSubmitBtn: {
      marginTop: sh(50),
    },
    viewResendBtn: {
      marginTop: sh(20),
    },
    titleText: {
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.h2),
      color: theme.colors.text,
      marginTop: sh(28),
    },
    descText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.para),
      color: theme.colors.text,
      marginTop: sh(20),
      marginBottom: sh(20),
    },
    viewOtpOuterContainer: {
      alignItems: 'center',
      flex: 1,
      marginHorizontal: sw(10),
    },
    OTPInputContainer: {
      width: '100%',
    },
    textInputContainer: {},
    roundedTextContainer: {
      width: sw(42),
      height: sw(50),
      borderColor: 'transparent',
      borderRadius: sw(5),
    },
    dotViewStyle: {
      width: sw(6),
      height: sw(6),
      borderRadius: sw(3),
    },
    circleTextContainer: {
      borderWidth: sw(2),
      width: sw(24),
      height: sw(24),
      borderColor: '#000',
      borderRadius: sw(12),
    },
    skipButtonText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.lead),
      color: theme.colors.supportive,
    },
    errorMsgText: {
      marginTop: sh(5),
      ...Typography.ts(theme.fonts.weight.regular, 16),
      color: Colors.RED,
    },
    tipsText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.desc),
      color: '#657693',
      textAlign: 'center',
      margin: sw(20),
      marginTop: sw(50),
    },
    logoutText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.lead),
      color: '#357CB6',
    },
  });
};

OtpScreen.defaultProps = {};
