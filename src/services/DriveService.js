import axios from 'axios';
import Constant from '../utils/Constant';
import moment from 'moment';
import FormData from 'form-data';
class DriveService {
  createFormData = (photo, body) => {
    const data = new FormData();

    if (Array.isArray(photo)) {
      photo.map((image) => {
        data.append(
          'album_images[]',
          {
            name:
              image.fileName ||
              Math.random().toString(36).substring(7) + 'test.jpg',
            type: image.type || image.mime,
            uri: image.path,
          },
          image.fileName ||
            Math.random().toString(36).substring(7) + 'test.jpg',
        );
      });

      // data.append('album_images',images);
    } else {
      data.append(
        'image',
        {
          name: photo.fileName || 'test.jpg',
          type: photo.type,
          uri: photo.uri.replace('file://', ''),
        },
        photo.fileName || 'test.jpg',
      );
    }

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  addDrive(driveDetail, invites, foodTypes, doner_id, donerName, image) {
    let requestData = {
      user_id: global.user.id.toString(),
      name: driveDetail.name,
      invite_peoples: JSON.stringify(invites || []),
      date: (moment(driveDetail.date) || moment()).format('YYYY-MM-DD'),
      donar_name: donerName,
      pickup_address: driveDetail.address,
      food_quality: driveDetail.foodQuantity,
      no_of_volunteers: driveDetail.numberOfVolunteers,
      food_type: JSON.stringify(foodTypes || []),
      description: driveDetail.description || '',
      status: '0',
      city_id: global.user.city_id,
      latitude: 23.0225,
      longitude: 72.5714,
      zone_id: global.user.zone_id,
      count_serve: 0,
      drive_time: moment(driveDetail.date).utc().format('HH:mm:ss'),
    };

    if (doner_id) {
      requestData.doner_id = doner_id;
    }

    let formData = requestData;
    if (image) {
      formData = this.createFormData(image, requestData);
    } else {
      formData.image = null;
    }
    const config = {
      'Content-Type': image ? 'multipart/form-data' : 'application/json',
    };

    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: Constant.addDriveURL,
        headers: config,
        data: formData,
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

  getComletedDrive() {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: Constant.completedDriveURL,
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

  getAllDrives() {
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: Constant.allDriveURL,
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

  getRecentRobins() {
    const url = Constant.recentRobinsURL + global.user.city_id;
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
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }

  nearDrive(location) {
    const {city_id} = global.user;
    const requestData = {
      city_id: city_id,

      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: Constant.nearbyZoneURL,
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

  getOverallSnapshop(zoneId, duration) {
    const url =
      Constant.overallSnapShorURL +
      '/' +
      zoneId +
      '/' +
      global.user.id +
      '/' +
      duration;
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
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }

  getDriveListOnZone(zoneId, duration) {
    const url =
      Constant.driveListOnZoneURL +
      '/' +
      zoneId +
      '/' +
      global.user.id +
      '/' +
      duration;
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
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }

  getDriveDetail(driveId) {
    const url = Constant.singleDriveURL + '/' + driveId;
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
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }

  getUpcomingDrive() {
    const url = Constant.upcomingDriveURL + '/' + global.user.id;
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
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }

  getUpcomingDriveById(driveId) {
    const url = Constant.upcomingDriveDetailURL + '/' + driveId;
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
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }

  getCompleteDriveById(driveId) {
    const url = Constant.completeDriveDetailURL + '/' + driveId;
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
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }

  getFoodDonationDrive() {
    const url = Constant.foodDonationDriveURL;
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
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }

  getCurrentDriveDetail(driveId) {
    const url = Constant.currentDriveDetailURL + '/' + driveId;
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
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }

  completeDrive(driveId, driveDetail) {
    const url =
      Constant.completeCurrentDriveURL + '/' + global.user.id + '/' + driveId;

    const {total_robins, food_quantity, description, count_serve} = driveDetail;

    const requestData = {
      food_quantity,
      total_robins,
      description,
      count_serve,
    };

    let formData = this.createFormData(driveDetail.album_images, requestData);

    const config = {'Content-Type': 'multipart/form-data'};

    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: url,
        headers: config,
        data: formData,
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

  cancelDrive(driveId, reasonId, message) {
    const requestData = {
      cancle_message: message || '',
    };
    const url = Constant.cancelDriveURL + '/' + driveId + '/' + reasonId;
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: url,
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

  removeDriveRobin(driveId, robinId, message) {
    const url = Constant.removeDriveRobinURL + '/' + driveId + '/' + robinId;
    const requestData = {
      message: message || '',
    };
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: url,
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

  getUserJoinDriveStatus(driveId) {
    const url = Constant.joinStatusURL + '/' + driveId + '/' + global.user.id;

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
          if (!error.status) {
            error.message = 'Check your internet connection and try again';
          }
          reject(error);
        });
    });
  }

  joinDrive(driveId, reasonId) {
    const url = Constant.joinDriveURL + '/' + driveId + '/' + global.user.id;
    const requestedData = {
      reason_id: reasonId,
    };
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: url,
        data: requestedData,
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

  uploadImageInDrive(driveId, images) {
    const url = Constant.uploadImageURL + '/' + driveId;
    let formData = this.createFormData(images, {});

    const config = {'Content-Type': 'multipart/form-data'};

    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: url,
        headers: config,
        data: formData,
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

  getNextFoodDonationDrive(filterOption) {
    const url = Constant.nextFoodDonationDriveURL; // + "/" + global.user.city_id;
    let requestData = {
      city_id: global.user.city_id,
      start_date:
        filterOption && filterOption.startDate
          ? moment(filterOption.startDate).format('YYYY-MM-DD')
          : undefined,
      end_date:
        filterOption && filterOption.endDate
          ? moment(filterOption.endDate).format('YYYY-MM-DD')
          : undefined,
      zone_id:
        filterOption && filterOption.zone ? filterOption.zone : undefined,
      robins:
        filterOption && filterOption.robins ? filterOption.robins : undefined,
    };
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: url,
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
}

export default new DriveService();
