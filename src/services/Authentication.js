import axios from 'axios';
// axios.defaults.headers.post['Accept'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.post['Authorization'] = 'Bearer fHsLHoHXpdqgYH8VPBFn1yEa5NV3NrxmizZUMuMxtSxZr60HfB';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
// import messaging, { AuthorizationStatus } from '@react-native-firebase/messaging';

import Contstant from '../utils/Constant';
class Authentication {
  constructor() {
    this.uniqueId = DeviceInfo.getUniqueId();
  }

  // setAuthToken(token) {
  //     // axios.defaults.headers['X-Person-Project-Token'] = token;
  // }

  login(email, password) {
    const requestData = {
      email: email,
      password: password,
    };
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: Contstant.loginURL,
        data: requestData,
      })
        .then((response) => {
          // handle success
          resolve(response.data);
        })
        .catch((error) => {
          // handle error
          if (error.response) {
            reject(error.response.data);
          }
          reject(error);
        });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: Contstant.logoutURL,
        data: {
          api_token: global.user.api_token,
        },
      })
        .then((response) => {
          // handle success
          delete axios.defaults.headers['X-Person-Project-Token'];
          resolve(response.data);
        })
        .catch((error) => {
          // handle error
          if (error.response) {
            reject(error.response.data);
          }
          reject(error);
        });
    });
  }

  register(userDetail, userType) {
    const requestData = {
      firstname: userDetail.firstname,
      lastname: userDetail.lastname,
      email: userDetail.email,
      phone: userDetail.phone,
      country_id: userDetail.country_id,
      state_id: userDetail.state_id,
      city_id: userDetail.city_id,
      zone_id: userDetail.zone_id,
      password: userDetail.password,
      password_confirmation: userDetail.password_confirmation,
      type: userType ? 'doner' : 'volunteer',
      bod: moment(userDetail.bod).format('YYYY-MM-DD'),
    };
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: Contstant.registerURL,
        data: requestData,
      })
        .then((response) => {
          // handle success
          resolve(response.data);
        })
        .catch((error) => {
          // handle error
          if (error.response) {
            reject(error.response.data);
          }
          reject(error);
        });
    });
  }

  forgotPassword(email) {
    const requestData = {
      email: email,
    };
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: Contstant.forgotPasswordURL,
        data: requestData,
      })
        .then((response) => {
          // handle success
          resolve(response.data);
        })
        .catch((error) => {
          // handle error
          if (error.response) {
            reject(error.response.data);
          }
          reject(error);
        });
    });
  }

  otpVerification(email, token) {
    const requestData = {
      email: email,
      token: token,
    };
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: Contstant.otpVerificationURL,
        data: requestData,
      })
        .then((response) => {
          // handle success
          resolve(response.data);
        })
        .catch((error) => {
          // handle error
          if (error.response) {
            reject(error.response.data);
          }
          reject(error);
        });
    });
  }

  resetPassowrd(email, password, password_confirmation) {
    const requestData = {
      email: email,
      password: password,
      password_confirmation: password_confirmation,
    };
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: Contstant.resetPasswordURL,
        data: requestData,
      })
        .then((response) => {
          // handle success
          resolve(response.data);
        })
        .catch((error) => {
          // handle error
          if (error.response) {
            reject(error.response.data);
          }
          reject(error);
        });
    });
  }

  signinWithFacebook(token) {
    const requestData = {
      user: {
        accessToken: token,
        'Device-Id': this.uniqueId,
      },
    };
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: Contstant.facebookSigninURL,
        data: requestData,
      })
        .then((response) => {
          // handle success
          resolve(response.data);
          if (response.data.data) {
            this.setAuthToken(response.data.data.token);
          }
        })
        .catch((error) => {
          // handle error
          if (error.response) {
            reject(error.response.data);
          }
          reject(error);
        });
    });
  }

  checkEmailExist(email) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: Contstant.checkEmailURL + '?email=' + encodeURIComponent(email),
      })
        .then((response) => {
          // handle success
          resolve(response.data);
        })
        .catch((error) => {
          // handle error
          if (error.response) {
            reject(error.response.data);
          }
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }

  resendConformaiton(email) {
    const requestData = {
      email_id: email,
    };
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: Contstant.resendConformaitonEmailURL,
        data: requestData,
      })
        .then((response) => {
          // handle success
          resolve(response.data);
        })
        .catch((error) => {
          // handle error
          if (error.response) {
            reject(error.response.data);
          }
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }

  async setAuthToken(userId) {
    const uniqueId = DeviceInfo.getUniqueId();

    const requestData = {
      token: global.fcmToken,
      user_id: userId,
      device_id: uniqueId,
    };

    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: Contstant.tokenRegisterURL,
        data: requestData,
      })
        .then((response) => {
          // handle success
          resolve(response.data);
        })
        .catch((error) => {
          // handle error
          if (error.response) {
            reject(error.response.data);
          }
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }
}

export default new Authentication();
