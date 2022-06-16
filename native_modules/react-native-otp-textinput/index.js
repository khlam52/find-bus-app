import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  textInput: {
    color: 'transparent',
    height: 0,
    width: 0,
    margin: 0,
  },
});

class OTPTextView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: 0,
      otpText: [],
    };
    this.inputs = [];
  }

  componentDidMount() {
    const { defaultValue, cellTextLength } = this.props;
    this.otpText = defaultValue.match(
      new RegExp('.{1,' + cellTextLength + '}', 'g'),
    );
  }

  onTextChange = async (text) => {
    const { cellTextLength, inputCount, handleTextChange } = this.props;
    console.log('OTP -> onTextChange -> text', text);
    if (text.length === inputCount) {
      // this.resetInput();
      this.setState({ focusedInput: 6 });
    } else {
      await this.setState({ focusedInput: text.length });
    }
    handleTextChange(text);
  };
  clearInput() {
    this.inputs.clear();
    this.setState({ focusedInput: 0 });
  }

  resetInput() {
    const { handleTextChange } = this.props;

    //Android can't focus and clear
    // console.log('someone is trying to resetInput');
    this.setState({ focusedInput: 0 });
    this.inputs.clear();
    handleTextChange('');
    setTimeout(() => {
      if (Platform.os === 'ios') {
        this.textInput.blur();
      }
      this.inputs.focus();
    }, 100);
  }

  resetInputWithNoFocus() {
    this.setState({ focusedInput: 0 });
    this.inputs.clear();
  }

  focusFirst = () => {
    this.inputs.focus();
  };

  render() {
    const {
      inputCount,
      offTintColor,
      tintColor,
      defaultValue,
      cellTextLength,
      needMasked,
      kbType,
      isDisableInput,
      isInputOTPEditable,
      containerStyle,
      showDot,
      dotViewStyle,
      ...textInputProps
    } = this.props;

    const TextInputs = [];
    const inputStyle = [styles.textInput, { borderColor: offTintColor }];

    for (let i = 0; i < inputCount; i += 1) {
      const textContainerStyle = [
        this.props.textContainerStyle,
        {
          backgroundColor: offTintColor,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ];

      if (!showDot) {
        if (this.state.focusedInput >= i + 1) {
          textContainerStyle.push({ backgroundColor: tintColor });
        }
        TextInputs.push(<View style={textContainerStyle} key={i} />);
      } else {
        if (this.state.focusedInput >= i + 1) {
          TextInputs.push(
            <View style={textContainerStyle} key={i}>
              <View
                style={{
                  backgroundColor: tintColor,
                  ...dotViewStyle,
                }}
              />
            </View>,
          );
        } else {
          TextInputs.push(<View style={textContainerStyle} key={i} />);
        }
      }
    }
    return (
      <View>
        <TextInput
          ref={(e) => {
            this.inputs = e;
          }}
          caretHidden={true}
          allowFontScaling={false}
          style={styles.textInput}
          maxLength={this.props.inputCount}
          onChangeText={(text) => this.onTextChange(text)}
          textContentType={'none'}
          multiline={false}
          secureTextEntry={this.props.needMasked}
          keyboardType={this.props.kbType}
          blurOnSubmit={false}
          textAlign={'center'}
          value={this.state.forceUpdate !== null && this.state.forceUpdate}
          editable={this.props.editable || true}
          autoFocus={false}
          {...textInputProps}
        />
        <TouchableOpacity
          onPress={() => {
            if (this.props.editable) {
              this.resetInput();
            }
          }}
          style={[styles.container, containerStyle]}>
          {TextInputs}
        </TouchableOpacity>
      </View>
    );
  }
}

OTPTextView.propTypes = {
  defaultValue: PropTypes.string,
  inputCount: PropTypes.number,
  containerStyle: PropTypes.object,
  textContainerStyle: PropTypes.object,
  cellTextLength: PropTypes.number,
  tintColor: PropTypes.string,
  offTintColor: PropTypes.string,
  handleTextChange: PropTypes.func,
  inputType: PropTypes.string,
  needMasked: PropTypes.bool,
  kbType: PropTypes.string,
  showDot: PropTypes.bool,
  dotViewStyle: PropTypes.object,
};

OTPTextView.defaultProps = {
  defaultValue: '',
  inputCount: 4,
  tintColor: '#3CB371',
  offTintColor: '#DCDCDC',
  cellTextLength: 1,
  containerStyle: {},
  textContainerStyle: {},
  needMasked: false,
  kbType: 'default',
  handleTextChange: () => {},
  showDot: true,
  dotViewStyle: {},
};

export default OTPTextView;
