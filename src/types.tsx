import {
    TextInputProps,
    TextStyle,
    ViewStyle,
    ImageStyle,
  } from 'react-native';

export interface Props extends TextInputProps {
    /** Style to the container of whole component */
    containerStyles?: ViewStyle;
    /** Changes the color for hide/show password image */
    darkTheme?: true | false ;
    /** Set this to true if you want the label to be always at a set position. Commonly used with hint for displaying both label and hint for your input. Default false. */
    staticLabel?: boolean;
    /** Hint displays only when staticLabel prop is set to true. This prop is used to show a preview of the input to the user */
    hint?: string;
    /** Set the color to the hint */
    hintTextColor?: string;
    /** Value for the label, same as placeholder */
    label: string;
    /** Style to the label */
    labelStyles?: TextStyle;
    /** Set this to true if is password to have a show/hide input and secureTextEntry automatically*/
    isPassword?: true | false ;
    /** Callback for action submit on the keyboard */
    onSubmit?: Function;
    /** Style to the show/hide password container */
    showPasswordContainerStyles?: ViewStyle;
    /** Style to the show/hide password image */
    showPasswordImageStyles?: ImageStyle;
    /** Style to the input */
    inputStyles?: TextStyle;
    /** Path to your custom image for show input */
    customShowPasswordImage?: string;
    /** Path to your custom image for hide input */
    customHidePasswordImage?: string;
    /** Custom Style for position, size and color for label, when it's focused or blurred*/
    customLabelStyles?: CustomLabelProps;
    /** Required if onFocus or onBlur is overrode */
    isFocused?: boolean;
    /** Set a mask to your input*/
    mask?: string;
    /** Set mask type*/
    maskType?: 'currency' | 'phone' | 'date' | 'card';
    /** Set currency thousand dividers*/
    currencyDivider?: ',' | '.';
    /** Maximum number of decimal places allowed for currency mask. */
    maxDecimalPlaces?: number;
    /** Changes the input from single line input to multiline input*/
    multiline?: true | false ;
    /** Maximum number of characters allowed. Overridden by mask if present */
    maxLength?: number;
    /** Shows the remaining number of characters allowed to be typed if maxLength or mask are present */
    showCountdown?: true | false ;
    /** Style to the countdown text */
    showCountdownStyles?: TextStyle;
    /** Label for the remaining number of characters allowed shown after the number */
    countdownLabel?: string;
    /** Set your custom show password component */
    customShowPasswordComponent?: JSX.Element;
    /** Set your custom hide password component */
    customHidePasswordComponent?: JSX.Element;
    /** Callback for show/hide password */
    onTogglePassword?: (show:boolean)=>void;
      /** Add left component to your input. Usually used for displaying icon */
    leftComponent?: JSX.Element;
  }

  export interface SetGlobalStyles {
    /** Set global styles to all floating-label-inputs container*/
    containerStyles?: ViewStyle,
    /** Set global custom styles to all floating-label-inputs labels*/
    customLabelStyles?: CustomLabelProps,
    /** Set global styles to all floating-label-inputs input*/
    inputStyles?: TextStyle,
    /** Set global styles to all floating-label-inputs label*/
    labelStyles?: TextStyle,
    /** Set global styles to all floating-label-inputs show password container*/
    showPasswordContainerStyles?: ViewStyle,
    /** Set global styles to all floating-label-inputs show password image*/
    showPasswordImageStyles?: ImageStyle,
    /** Set global style to the countdown text */
    showCountdownStyles?: TextStyle,
  }
  
  export interface CustomLabelProps {
    leftFocused?: number;
    leftBlurred?: number;
    topFocused?: number;
    topBlurred?: number;
    fontSizeFocused?: number;
    fontSizeBlurred?: number;
    colorFocused?: string;
    colorBlurred?: string;
  }
  
    /** Set global styles for all your floating-label-inputs*/
  export const setGlobalStyles: SetGlobalStyles = {
    /**Set global styles to all floating-label-inputs container*/
    containerStyles: undefined as ViewStyle | undefined,
    /**Set global custom styles to all floating-label-inputs labels*/
    customLabelStyles: undefined as CustomLabelProps | undefined,
    /**Set global styles to all floating-label-inputs input*/
    inputStyles: undefined as TextStyle | undefined,
    /**Set global styles to all floating-label-inputs label*/
    labelStyles: undefined as TextStyle | undefined,
    /**Set global styles to all floating-label-inputs show password container*/
    showPasswordContainerStyles: undefined as ViewStyle | undefined,
    /**Set global styles to all floating-label-inputs show password image*/
    showPasswordImageStyles: undefined as ImageStyle | undefined,
    /**Set global style to the countdown text */
    showCountdownStyles: undefined as TextStyle | undefined,
  };