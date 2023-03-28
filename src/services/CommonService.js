
import axios from 'axios';
// axios.defaults.headers.post['Accept'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'application/json';

import Contstant from '../utils/Constant';
class CommonService {




    getCountries() {

        return (new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: Contstant.countriesURL
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

    getState(countryid) {

        return (new Promise((resolve, reject) => {

            const url = Contstant.stateURL + countryid;

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

    getCity(stateid) {

        return (new Promise((resolve, reject) => {

            const url = Contstant.cityURL + stateid;

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

    getZone(zoneid) {

        return (new Promise((resolve, reject) => {

            const url = Contstant.zoneURL + zoneid;

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

    getFoodType() {
        return (new Promise((resolve, reject) => {

            const url = Contstant.foodtypeURL;

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

    getFoodType() {
        return (new Promise((resolve, reject) => {

            const url = Contstant.foodtypeURL;

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


    getDriveZone(){
        return (new Promise((resolve, reject) => {

            const url = Contstant.zoneSelectionURL+"/"+global.user.id;

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

    getDriveCancelReason(){
        return (new Promise((resolve, reject) => {

            const url = Contstant.cancelDriveReasonsURL;

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

    getDonerList(string){
        
        return (new Promise((resolve, reject) => {

            const url = string?Contstant.donerListURL + "/"+string:Contstant.donerListURL;

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

    getCMS(slug){
        return (new Promise((resolve, reject) => {

            const url = Contstant.cmsURL + "/"+slug;

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

    getJoinReason(){
        return (new Promise((resolve, reject) => {

            const url = Contstant.joinReasonURL;

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

}

export default (new CommonService());