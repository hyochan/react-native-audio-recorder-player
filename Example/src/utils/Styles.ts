import { Dimensions } from 'react-native';

const { width , height } = Dimensions.get('window');
const calRatio = (16 * (width / height));

export const screenWidth = width;
export const screenHeight = height;
export const ratio = (calRatio < 9 ? width / 9 : height / 18) / (360 / 9);

interface Icolors {
  background: string;
  dodgerBlue: string;
  dusk: string;
  blueyGray: string;
  cloudyBlue: string;
}

export const colors: Icolors = {
  background: 'rgb(65, 77, 107)',
  dodgerBlue: 'rgb(58,139,255)',
  dusk: 'rgb(65,77,107)',
  blueyGray: 'rgb(134,154,183)',
  cloudyBlue: 'rgb(175,194,219)',
};
