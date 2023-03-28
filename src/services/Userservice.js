
import axios from 'axios';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

import Contstant from '../utils/Constant';
import DriveService from './DriveService';
import Constant from '../utils/Constant';
import moment from 'moment';

class UserService {




    getInviteUserList() {
        const url = Contstant.inviteURL + '/' + global.user.id + '/' + global.user.city_id
        return (new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: url
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

    dashboardCount() {
        const { city_id, zone_id, id } = global.user;
        const requestData = {
            "city_id": city_id,
            "zone_id": zone_id,
            "user_id": id
        }
        return (new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: Contstant.dashboradCountURL,
                data:requestData
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

    updateProfile(userDetail,image) {
        const requestData = {
            "user_id": global.user.id,
            "firstname": userDetail.firstname,
            "lastname": userDetail.lastname,
             "email": userDetail.email,
            "phone": userDetail.phone,
            "country_id": userDetail.country_id,
            "state_id": userDetail.state_id,
            "city_id": userDetail.city_id,
            "zone_id": userDetail.zone_id,
            "old_image": global.user.image,
            "type":userDetail.type,
            "bod":userDetail.bod?moment(userDetail.bod).format('YYYY-MM-DD'):""
        }


        let formData = requestData;
        if (image) {
            formData = DriveService.createFormData(image, requestData);
        }else{
            formData.image=null;
        }
        const config = { 'Content-Type': image?`multipart/form-data`:'application/json' } ;
         


        return (new Promise((resolve, reject) => {

            axios({
                method: 'POST',
                url: Contstant.profileURL,
                headers: config,
                data: formData
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



    getMyDrives(){

        const url = Constant.myDrivesURL+ "/"+ global.user.id;
        return (new Promise((resolve, reject) => {

            axios({
                method: 'GET',
                url:url
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

    startDrive(driveId){
        const url = Constant.startMyDriveURL + "/" + global.user.id+ "/" + driveId ;
        return (new Promise((resolve, reject) => {

            axios({
                method: 'GET',
                url:url
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

    endDrive(driveId,serveCount){
        const url = Constant.endDriveURL + "/" + global.user.id+ "/" + driveId ;
        const requestData = {
            "count_serve": serveCount
        }
        return (new Promise((resolve, reject) => {

            axios({
                method: 'POST',
                url:url,
                data:requestData
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

    achivements(){
        const url = Constant.achivementsURL + "/" + global.user.id ;
      
        return (new Promise((resolve, reject) => {

            axios({
                method: 'GET',
                url:url
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

    getCurrentDrive(){
        const url = Constant.currentDriveURL + "/" + global.user.id ;
      
        return (new Promise((resolve, reject) => {

            axios({
                method: 'GET',
                url:url
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


    getUserNotification(){
        const url = Constant.notificationURL + "/" + global.user.id ;
      
        return (new Promise((resolve, reject) => {

            axios({
                method: 'GET',
                url:url
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


    getRequestedDrive(){


         const url = Constant.requestedDriveURL + "/" + global.user.id ;
      
        return (new Promise((resolve, reject) => {

            axios({
                method: 'GET',
                url:url
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


    acceptDrive(driveId){


        const url = Constant.driveAcceptURL + "/" + driveId + "/"+ global.user.id ;
     
       return (new Promise((resolve, reject) => {

           axios({
               method: 'GET',
               url:url
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


  rejectDrive(driveId){


    const url = Constant.driveRejectURL + "/" + driveId + "/"+ global.user.id ;
 
   return (new Promise((resolve, reject) => {

       axios({
           method: 'GET',
           url:url
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

export default (new UserService());