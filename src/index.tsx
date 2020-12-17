import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  TextInput,
  Platform,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Text,
  Image,
  TouchableOpacity,
  TextInputProps,
  TextStyle,
  ViewStyle,
  ImageStyle,
  TouchableWithoutFeedback,
  LayoutChangeEvent,
} from 'react-native';
import Animated, { Clock, useCode, interpolate, Easing, Value, set }from 'react-native-reanimated';
import debounce from 'lodash/debounce';
import { styles } from './styles';
import { CustomLabelProps, Props, SetGlobalStyles, setGlobalStyles} from './types';
import { timing } from './animationUtils';

import makeVisibleWhite from './assets/make_visible_white.png';
import makeInvisibleWhite from './assets/make_invisible_white.png';
import makeVisibleBlack from './assets/make_visible_black.png';
import makeInvisibleBlack from './assets/make_invisible_black.png';

interface InputRef {
  focus(): void;
  blur(): void;
}

const onExecution = (event: NativeSyntheticEvent<TextInputFocusEventData>, 
  innerFunc: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void, 
  outerFunc?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void) => {
  innerFunc && innerFunc(event);
  outerFunc && outerFunc(event);
}

const getAndroidExtraPadding = (textInputFontSize: number) => {
  if (Platform.OS === "android") {
    let defaultPadding = 6;
    if (textInputFontSize < 14) {
      defaultPadding = defaultPadding + (14 - textInputFontSize)
    }
    return defaultPadding;
  }
  return 0;
}

const getLabelPositions = (style: TextStyle, labelStyle: TextStyle) => {
  const height = (style?.height as number || ((style?.paddingTop as number || 0)  + (style?.paddingBottom as number || 0))  || style?.padding as number) || 0;
  const textInputFontSize = style?.fontSize || 13;
  const labelFontSize = labelStyle?.fontSize || 13;
  const fontSizeDiff = textInputFontSize - labelFontSize;
  let unfocused, focused;


  unfocused = height * 0.5 + fontSizeDiff * (Platform.OS === "android" ? 0.5 : 0.6 )+ getAndroidExtraPadding(textInputFontSize);
  focused = -labelFontSize * 0.5;
  return [unfocused, focused]
}

const FONT_SIZE_BLURRED = 14;
const FONT_SIZE_FOCUSED = 10;

const FloatingLabelInput: React.ForwardRefRenderFunction<InputRef, Props> = (
  { label,
    mask,
    isPassword,
    maxLength,
    inputStyles,
    showCountdown,
    showCountdownStyles,
    labelStyles,
    darkTheme,
    countdownLabel,
    currencyDivider,
    maskType,
    onChangeText,
    secureTextEntry,
    customHidePasswordComponent,
    customShowPasswordComponent,
    isFocused,
    onBlur,
    onFocus,
    onTogglePassword,
    leftComponent,
    customHidePasswordImage,
    customLabelStyles = {},
    staticLabel = false,
    hint,
    hintTextColor,
    placeholder,
    placeholderTextColor,
    onSubmit,
    containerStyles,
    customShowPasswordImage,
    showPasswordContainerStyles,
    maxDecimalPlaces,
    multiline,
    showPasswordImageStyles,
    value="",
    onSelectionChange,
    ...rest},
    ref,
) => {
  
  const [focusedLabel, _onFocusLabel] = useState(!!value);
  const [focused, _onFocusTextInput] = useState(!!value);
  const [secureText, setSecureText] = useState(true);
  const [halfTop, setHalfTop] = useState(0);
  const inputRef = useRef<any>(null);
  const [animation, _] = useState(new Value(focusedLabel ? 1 : 0));
  const clock = new Clock();
  const debouncedOnFocusTextInput = debounce(_onFocusLabel, 500, { 'leading': true, 'trailing': false });

  // const [halfTop, setHalfTop] = useState(0)
  // const [isFocusedState, setIsFocused] = useState(false);
  // const [secureText, setSecureText] = useState(true);
  // const inputRef = useRef<any>(null);

  customLabelStyles = {
    fontSizeFocused: FONT_SIZE_FOCUSED,
    fontSizeBlurred: FONT_SIZE_BLURRED,
    colorFocused: '#49658c',
    colorBlurred: '#49658c',
    ...setGlobalStyles?.customLabelStyles,
    ...customLabelStyles,
  };

  useCode(
    () => set(
      animation,
      timing({
        clock,
        animation,
        duration: new Animated.Value(150),
        from: focusedLabel ? 0 : 1,
        to: focusedLabel ? 1 : 0,
        easing: Easing.linear,
      })
    ),
    [focusedLabel]
  )

  useEffect(
    () => {
      if (!focusedLabel && value) {
        debouncedOnFocusTextInput(true)
      }
      if (focusedLabel && !value) {
        debouncedOnFocusTextInput(false)
      }
    },
    [value]
  )

  let input: TextStyle = inputStyles !== undefined ? inputStyles : setGlobalStyles?.inputStyles !== undefined ? setGlobalStyles.inputStyles : styles.input

  const floatingLabelStyle: TextStyle = {
    ...setGlobalStyles?.labelStyles,
    ...labelStyles,
    left: labelStyles?.left !== undefined ? labelStyles?.left : 10,
    fontSize: staticLabel? (customLabelStyles?.fontSizeFocused !== undefined ? customLabelStyles.fontSizeFocused : 10) : !focused
      ? customLabelStyles.fontSizeBlurred
      : customLabelStyles.fontSizeFocused,
    color: !focused
      ? customLabelStyles.colorBlurred
      : customLabelStyles.colorFocused,
    alignSelf: 'center',
    position: 'absolute',
    flex:1,
    zIndex: 999,
  };

  const focusStyle = {
    top: interpolate(animation, {
      inputRange: [0, 1],
      outputRange: [...getLabelPositions(input, (floatingLabelStyle))]
    }),
    fontSize: interpolate(animation, {
      inputRange: [0, 1],
      outputRange: [16, 13]
    }),
    // backgroundColor: (
    //   focusedLabel
    //     ? theme.PRIMARY_BACKGROUND_COLOR
    //     : 'transparent'
    // ),
  };


  function handleFocus(event:  NativeSyntheticEvent<TextInputFocusEventData>) {
    onExecution(event, () => { _onFocusLabel(true); _onFocusTextInput(true) }, () => onFocus?.(event));
  }

  function handleBlur(event:  NativeSyntheticEvent<TextInputFocusEventData>) {
    onExecution(event, () => { _onFocusLabel(!!value); _onFocusTextInput(false) }, () => onBlur?.(event));
  }

  function setFocus() {
    inputRef.current?.focus();
  }

  function _toggleVisibility() {
    if  (onTogglePassword) {
      onTogglePassword(!secureText);
    }
    if (secureText) {
      setSecureText(false);
    } else {
      setSecureText(true);
    }
  }

  function onSubmitEditing() {
    if (onSubmit !== undefined) {
      onSubmit();
    }
  }

  let imgSource = darkTheme
    ? secureText
      ? customShowPasswordImage
        ? customShowPasswordImage
        : makeInvisibleBlack
      : customHidePasswordImage
      ? customHidePasswordImage
      : makeVisibleBlack
    : secureText
    ? customShowPasswordImage
      ? customShowPasswordImage
      : makeInvisibleWhite
    : customHidePasswordImage
    ? customHidePasswordImage
    : makeVisibleWhite;

  
  
  input = {
    ...input,
    color: input.color !== undefined ? input.color : customLabelStyles.colorFocused,
    zIndex: floatingLabelStyle?.zIndex !== undefined ? floatingLabelStyle.zIndex - 2 : 0,
  };

  containerStyles =
    containerStyles !== undefined
      ? containerStyles
      : setGlobalStyles?.containerStyles !== undefined
      ? setGlobalStyles?.containerStyles
      : styles.container;

  containerStyles = {
    ...containerStyles,
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: floatingLabelStyle?.zIndex !== undefined ? floatingLabelStyle.zIndex - 6: 0
  }

  let toggleButton =
  showPasswordContainerStyles !== undefined
    ? showPasswordContainerStyles
    : setGlobalStyles?.showPasswordContainerStyles !== undefined
    ? setGlobalStyles.showPasswordContainerStyles
    : styles.toggleButton;

  toggleButton = {
    ...toggleButton,
    alignSelf: 'center',
  };

  let img =
    showPasswordImageStyles !== undefined
      ? showPasswordImageStyles
      : setGlobalStyles?.showPasswordImageStyles !== undefined
      ? setGlobalStyles.showPasswordImageStyles
      : styles.img;

  img = {
    height: 25,
    width: 25,
    ...img,
  };

  const countdown = {
    ...styles.countdown,
    ...setGlobalStyles?.showCountdownStyles,
    ...showCountdownStyles,
  };

  function onChangeTextHandler(val: string){
    if (maskType !== undefined || mask !== undefined) {
      if (maskType !== 'currency' && mask !== undefined) {          
        let unmasked = val.replace(/[^0-9A-Za-z]/g,'');
      
      // pegar as posições dos caracteres especiais.
        let positions = [];
        for(let i =0;i<mask.length;i++){
          if(mask[i].match(/[^0-9A-Za-z]/)){
            positions.push(i);
          }
        }

        let newValue = ""
        let offset = 0;
        for(let j=0;j<unmasked.length;j++){
          // adicionar caracteres especiais 
          while(mask[j+offset]?.match(/[^0-9A-Za-z]/)){
            newValue += mask[j+offset]
            offset++;
          }
          newValue += unmasked[j]
        }

        return onChangeText ? onChangeText(newValue) : false;

      } else if (maskType === 'currency') {
        let divider = '';
        let decimal = '';
        if (currencyDivider === ',') {
          divider = ',';
          decimal = '.';
        } else {
          divider = '.';
          decimal = ',';
        }
        if (
          value !== undefined &&
          value.length < val.length
        ) {
          if (val.includes(decimal)) {
            let intVal = val.split(decimal)[0].replace(/[,.]/g, '');
            let decimalValue = val.split(decimal)[1];
            if (intVal.length > 3) {
              let arr: string[] = [];
              for (let i = 0; i < intVal.length; i += 3) {
                arr.push(
                  intVal
                    .split('')
                    .splice(intVal.length - i, 3)
                    .join(''),
                );
              }

              arr = arr.reverse();
              arr.pop();
              let initial = arr.join('');
              if (intVal.includes(initial)) {
                intVal = intVal.replace(initial, '');
              }
              intVal = intVal + divider + arr.join(divider);
            }

            val = intVal + decimal + decimalValue;

            let decimalPlaces: number =
              maxDecimalPlaces !== undefined
                ? maxDecimalPlaces
                : 2;

            if (
              val.split(decimal)[1] !== undefined &&
              value.split(decimal)[1] !== undefined &&
              val.split(decimal)[1].length >
                value.split(decimal)[1].length &&
              value.split(decimal)[1].length === decimalPlaces
            ) {
              return;
            } else {
              if (val.split(decimal)[1].length > decimalPlaces) {
                val = val.slice(0, val.length - 1);
              }
            }
          } else {
            if (val.length > 3) {
              let arr: string[] = [];
              let unmasked = val.replace(/[,.]/g, '');
              for (let i = 0; i < unmasked.length; i += 3) {
                arr.push(
                  unmasked
                    .split('')
                    .splice(unmasked.length - i, 3)
                    .join(''),
                );
              }

              arr = arr.reverse();
              arr.pop();
              let initial = arr.join('');
              if (unmasked.includes(initial)) {
                unmasked = unmasked.replace(initial, '');
              }
              val = unmasked + divider + arr.join(divider);
            }
          }
        }
        return onChangeText ? onChangeText(val) : false;
      } else {
        return onChangeText ? onChangeText(val) : false;
      }
    } else {
      return onChangeText ? onChangeText(val) : false;
    }
  }

  function onLayout(event: LayoutChangeEvent) {
    var {height} = event.nativeEvent.layout;
    let fontSize;
    if(staticLabel) {
      fontSize = customLabelStyles.fontSizeFocused ? customLabelStyles.fontSizeFocused : FONT_SIZE_FOCUSED;
    } else {
      fontSize = customLabelStyles.fontSizeBlurred ? customLabelStyles.fontSizeBlurred : FONT_SIZE_BLURRED;
    }
    
    setHalfTop((height + fontSize / 2));
  }

  return (
    <TouchableWithoutFeedback onPress={setFocus} onLayout={onLayout}>
      <View style={containerStyles}>
        {leftComponent && leftComponent}
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Animated.Text
            onPress={setFocus}
            style={[
              floatingLabelStyle,
              focusStyle,
            ]}>
            {label}
          </Animated.Text>
          <TextInput
            value={value}
            onSubmitEditing={onSubmitEditing}
            secureTextEntry={
              isPassword !== undefined ? isPassword && secureText : false
            }
            onFocus={onFocus !== undefined ? onFocus : handleFocus}
            onBlur={onBlur !== undefined ? onBlur  : handleBlur}
            ref={inputRef}
            {...rest}
            maxLength={
              mask !== undefined
                ? mask.length
                : maxLength !== undefined
                ? maxLength
                : undefined
            }
            placeholderTextColor={hintTextColor}
            placeholder={(staticLabel || focused) && hint ? hint : ''}
            multiline={multiline}
            onChangeText={onChangeTextHandler}
            style={input}
          />
          {isPassword && (
            <TouchableOpacity style={toggleButton} onPress={_toggleVisibility}>
              {secureText && customShowPasswordComponent !== undefined ? (
                customShowPasswordComponent
              ) : !secureText && customHidePasswordComponent !== undefined ? (
                customHidePasswordComponent
              ) : (
                <Image source={imgSource} resizeMode="contain" style={img} />
              )}
            </TouchableOpacity>
          )}
        </View>
        {showCountdown && maxLength && (
          <Text style={countdown}>
            {maxLength - (value ? value.length : 0)} {countdownLabel}
          </Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
export { setGlobalStyles };
export default forwardRef(FloatingLabelInput);
