
import axios from 'axios';
import Contstant from '../utils/Constant';
import moment from 'moment';
class RobinService {



    newRequestRobin() {
       

       return (new Promise((resolve, reject) => {
        const url = Contstant.robinRequestURL + "/"+global.user.zone_id;
            axios({
                method: 'GET',
                url: url,
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


    getTopRobins (){
        
        return (new Promise((resolve, reject) => {
            const url = Contstant.topRobinsURL ;
                axios({
                    method: 'GET',
                    url: url,
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

export default (new RobinService());