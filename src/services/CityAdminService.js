
import axios from 'axios';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
import moment from 'moment';

import Contstant from '../utils/Constant';
import DriveService from './DriveService';
import Constant from '../utils/Constant';
class CityAdminService {




    getPendingConfirmationDrive(filterOption) {
        const url = Contstant.conformationDrivesURL;// + "/" + global.user.city_id;
        let requestData = {
            city_id: global.user.city_id,
            start_date: (filterOption && filterOption.startDate) ? moment(filterOption.startDate).format('YYYY-MM-DD') : undefined,
            end_date: (filterOption && filterOption.endDate) ? moment(filterOption.endDate).format('YYYY-MM-DD') : undefined,
            zone_id: (filterOption && filterOption.zone) ? filterOption.zone : undefined,
            robins: (filterOption && filterOption.robins) ? filterOption.robins : undefined
        }
        return (new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: url,
                data: requestData
            }).then((response) => {
                // handle success
                resolve(response.data);
            }).catch((error) => {
                // handle error
                if (error.response) {
                    reject(error.response.data);
                }

                reject(error);
            });
        }));
    }

    confirmDrive(driveDetail, invites, foodTypes, poc, doner_id, donar_name, images) {
        // invites=invites.push(driveDetail.poc || (poc[0] + ""));
        let requestData = {
            "user_id": driveDetail.user_id,
            "name": driveDetail.name,
            "invite_peoples": JSON.stringify(invites || []),
            "date": (moment(driveDetail.date) || moment()).format('YYYY-MM-DD'),
            "donar_name": donar_name,
            "pickup_address": driveDetail.pickup_address,
            "food_quality": driveDetail.food_quality,
            "no_of_volunteers": driveDetail.no_of_volunteers,
            "food_type": JSON.stringify(foodTypes || []),
            "description": driveDetail.description || "",
            "status": driveDetail.status || 0,
            "city_id": driveDetail.city_id || global.user.city_id,
            "latitude": driveDetail.latitude || 23.0225,
            "longitude": driveDetail.longitude || 72.5714,
            "zone_id": driveDetail.zone_id || global.user.zone_id,
            "count_serve": 0,
            "drive_id": driveDetail.drive_id,
            "poc": driveDetail.poc || (poc[0] + ""),
            "confirm": 1,
            "drive_time": (moment(driveDetail.date) || moment()).utc().format('HH:mm:ss')

        };

        if (doner_id) {
            requestData.doner_id = doner_id;
        }

        let formData = requestData;
        if (images) {
            formData = DriveService.createFormData(images, requestData);
        } else {
            formData.image = null;
        }
        const config = { 'Content-Type': images ? `multipart/form-data` : 'application/json' };

        return (new Promise((resolve, reject) => {

            axios({
                method: 'POST',
                url: Constant.addDriveURL,
                headers: config,
                data: formData
            })
                .then((response) => {
                    // handle success
                    resolve(response.data);
                }).catch((error) => {
                    // handle error
                    if (error.response) {
                        reject(error.response.data);
                    }
                    if (!error.status)
                        error.message = "Check your internet connection and try again";
                    reject(error);
                });
        }));
    }

    removeDriveImage(driveId, imageUrl) {

        const requestData = {
            name: imageUrl
        }

        const url = Constant.deleteImageDriveURL + "/" + driveId

        return (new Promise((resolve, reject) => {

            axios({
                method: 'POST',
                url: url,
                data: requestData
            }).then((response) => {
                // handle success
                resolve(response.data);
            }).catch((error) => {
                // handle error
                if (error.response) {
                    reject(error.response.data);
                }
                if (!error.status)
                    error.message = "Check your internet connection and try again";
                reject(error);
            });
        }));
    }


}

export default (new CityAdminService());