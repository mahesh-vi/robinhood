import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

class CommonUtil {
  staticOptions;
  hasNotch;
  logout = async (navigation) => {
    await AsyncStorage.multiRemove(['user', 'token']);

    navigation.navigate('Auth');
    navigation.dispatch({
      type: 'Navigation/RESET',
      index: 0,
      actions: [{type: 'Navigate', routeName: 'Signin'}],
    });
    delete global.user;
  };

  // isSimulator() {
  //     return DeviceInfo.isEmulatorSync();
  // }

  // hasDeviceNotch = async () => {

  //     const flag = await DeviceInfo.hasNotch();
  //     this.hasNotch = flag;
  // }

  capitalize(input) {
    var reg = /([^\W_]+[^\s-]*)/;
    return input
      ? input.replace(reg, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        })
      : '';
  }

  errorMessage(error, props) {
    var _this = this;
    const customError = error.error;
    const alertPopup = props.screenProps.alert;
    if (
      typeof error.message === 'string' ||
      !(typeof customError.message === 'object')
    ) {
      alertPopup({
        title: 'Error!',
        body: customError ? customError.message : error.message,
      });
    } else {
      let msg = '';
      Object.keys(customError.message).forEach(function (prop) {
        msg = msg + _this.capitalize(prop + ' ' + customError.message[prop]);
      });
      alertPopup({title: 'Error!', body: msg});
    }
    // if ((customError.hasOwnProperty('code') && customError.code == 401) || customError.hasOwnProperty('status') && customError.status == 401) {
    //     this.logout(props.navigation);
    // }
  }

  validateEmail = (email) => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  contains(target, pattern) {
    var strArr = [];
    var value = 0;
    pattern.forEach(function (word) {
      value = value + target.includes(word);
      if (target.includes(word)) {
        strArr.push(word);
      }
    });
    return strArr;
  }

  getTime = (date) => {
    if (date) {
      const isValidDate = moment(date, 'YYYY-MM-DDTHH:mm:ss', true).isValid();
      if (!isValidDate) {
        return moment(moment().format('YYYY-MM-DD ') + date).format('hh:mm A');
      }
      return moment(date).format('hh:mm A');
    }
    return '';
  };

  getValidDate = (date) => {
    const isValidDate = moment(date, 'YYYY-MM-DDTHH:mm:ss', true).isValid();
    if (!isValidDate) {
      return moment(moment().format('YYYY-MM-DD') + date).format(
        'YYYY-MM-DDTHH:mm:ss',
      );
    }
    return date;
  };

  /*
   * Important!
   * This snippet is deprecated, a best implementation of sortBy can be found here:
   * https://github.com/jherax/array-sort-by
   */

  sortBy = (array, cfg) => {
    var toString = Object.prototype.toString,
      // default parser function
      parse = function (x) {
        return x;
      },
      // gets the item to be sorted
      getItem = function (x) {
        var isObject = x != null && typeof x === 'object';
        var isProp = isObject && this.prop in x;
        return this.parser(isProp ? x[this.prop] : x);
      };

    /**
     * Sorts an array of elements.
     *
     * @param {Array} array: the collection to sort
     * @param {Object} cfg: the configuration options
     * @property {String}   cfg.prop: property name (if it is an Array of objects)
     * @property {Boolean}  cfg.desc: determines whether the sort is descending
     * @property {Function} cfg.parser: function to parse the items to expected type
     * @return {Array}
     */
    // return function sortby (array, cfg) {
    if (!(array instanceof Array && array.length)) {
      return [];
    }
    if (toString.call(cfg) !== '[object Object]') {
      cfg = {};
    }
    if (typeof cfg.parser !== 'function') {
      cfg.parser = parse;
    }
    cfg.desc = cfg.desc ? -1 : 1;
    return array.sort(function (a, b) {
      a = getItem.call(cfg, a);
      b = getItem.call(cfg, b);
      return cfg.desc * (a < b ? -1 : +(a > b));
    });
    // };
  };

  getUserImage(imageUrl) {
    if (imageUrl) {
      return {uri: imageUrl};
    } else {
      return require('../assets/images/user_male.png');
    }
  }
}
export default new CommonUtil();
