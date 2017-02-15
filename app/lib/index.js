
/*
 * @providesModule lib
 */
import react, {Component} from 'react';
import oc from 'oc';
import { PixelRatio, Dimensions, Platform, View } from 'react-native';

export const size = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
};

export const ratio = PixelRatio.get();

export const os = Platform.OS;

export const jumpForward = (route) => {
  try{
    route.jumpForward()
  } catch(e){
    console.log(e);
  }
}
