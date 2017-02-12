
/*
 * @providesModule lib
 */

import { PixelRatio, Dimensions, Platform } from 'react-native';

export const size = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
};

export const ratio = PixelRatio.get();

export const os = Platform.OS;
