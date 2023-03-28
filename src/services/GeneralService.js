import axios from 'axios';
// axios.defaults.headers.post['Accept'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'application/json';

import Contstant from '../utils/Constant';
class GeneralService {
  getTotalDrive(duration) {
    const url = Contstant.totalDriveURL + '/' + global.user.id + '/' + duration;
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: url,
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
}

export default new GeneralService();
