import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { NativeModules } from 'react-native';

configure({ adapter: new Adapter() });

console.error = (message) => {
  if (!/(React.createElement: type should not be null)/.test(message)) {
    throw new Error(message);
  }
};

/**
 * monkey patching the locale to avoid the error:
 * Something went wrong initializing the native ReactLocalization module
 * https://gist.github.com/MoOx/08b465c3eac9e36e683929532472d1e0
 */

NativeModules.ReactLocalization = {
  language: 'en_US',
};
