import React, { Component, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    ScrollView,
    Dimensions,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList

} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle'
import CancelDrive from './CancelDrive';
import RemoveRobin from './RemoveRobin';
import { Map } from '../../components/MapView';
import CommonUtil from '../../utils/CommonUtil';
import Loader from '../../components/Loader';
import DriveDetailView from '../../components/DriveDetailView';
import LeaveDrive from '../../components/LeaveDrive';

import DriveService from '../../services/DriveService';
import Userservice from '../../services/Userservice';

export default class ActiveDrive extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showCancelPopup: false,
            showRemoveRobin: false,
            isDrive: 0,

        };
        this.driveUpdateListener=this.driveUpdateListener.bind(this);
    }

    


    UNSAFE_componentWillMount() {

        this.getData();

        this.eventEmitter = this.props.screenProps.eventEmitter;
        if (!this.eventEmitter.listeners('DriveUpdate').length) {
            this.eventEmitter.addListener('DriveUpdate', this.driveUpdateListener);
        }

    }

    componentWillUnmount() {
        this.eventEmitter.removeListener('DriveUpdate', this.driveUpdateListener);
    }

    driveUpdateListener(data) {
        var _this = this;
        _this.setState({
            driveData: undefined,
        });
        _this.getData();
    }


    getData() {
        const driveId = this.props.navigation.getParam('driveId', null);
        this.setState({ loading: true });
        DriveService.getCurrentDriveDetail(driveId).then((res) => {
            console.log('Current Drive Detail', res);
            let drive = res.data;
            drive.joinStatus = true;
            this.setState({ loading: false, drive: drive });
        }).catch((error) => {
            this.setState({ loading: false });
            console.log(error);
        });
    }

    // removeRobin(message) {
    //     const driveId = this.state.drive.id;
    //     const robinId = this.state.selectedRobin.id;
    //     this.setState({ loading: true });
    //     DriveService.removeDriveRobin(driveId, robinId, message).then((res) => {
    //         console.log('Current Drive Detail', res);

    //         var robins = this.state.drive.robins.filter((item) => item.id != robinId);
    //         var driveData = this.state.drive;
    //         driveData.robins = robins;

    //         this.setState({ loading: false, showRemoveRobin: false, drive: driveData });
    //     }).catch((error) => {
    //         this.setState({ loading: false });
    //         console.log(error);
    //     });
    // }

    startDrive = () => {
        this.setState({ loading: true });
        const driveDetail = this.state.drive;
        let driveId = driveDetail.drive_id || driveDetail.id
        Userservice.startDrive(driveId).then((res) => {
            console.log(res);

            this.setState({ loading: false });

            this.props.screenProps.alert({
                title: 'Robinhood',
                body: this.state.drive.drive_name + ' drive start.',
            });
            this.props.navigation.goBack();
            //this.setState({ drives: res.data });
        }).catch((error) => {
            this.setState({ loading: false });
            console.log(error);
        });
    }

    editDrive = () => {
        const driveDetail = this.state.drive;
        let data = {
            "user_id": driveDetail.user_id,
            "name": driveDetail.drive_name,
            "invite_peoples": driveDetail.invite_peoples,
            "date": driveDetail.drive_date,
            "pickup_address": driveDetail.pickup_address,
            "food_quality": driveDetail.food_quality,
            "no_of_volunteers": driveDetail.no_of_volunteers,
            "foodtypes": driveDetail.foodtypes,
            "description": driveDetail.description || "",
            "latitude": driveDetail.latitude,
            "longitude": driveDetail.longitude,
            "zone_id": driveDetail.zone_id,
            "drive_id": driveDetail.drive_id,
            "poc": driveDetail.admin.length > 0 ? driveDetail.admin[0].admin_id : undefined,
            "doner_id": driveDetail.doner_id,
            "donar_name": driveDetail.donar_name,
            "status": driveDetail.status,
            "image_url": driveDetail.drive_image,
            "album_images": driveDetail.complete_images,
            "drive_time":driveDetail.drive_time
        };


        this.props.navigation.navigate('DashboardConfirmDrive', {
            drive: data
        });
    }


    removeRobin = (robinId) => {
        var _this = this;
        var robins = _this.state.drive.robins.filter((item) => item.id != robinId);
        var driveData = _this.state.drive;
        driveData.robins = robins;
        _this.setState({ driveData: drive });
    }

    onRemoveDriveImage = (index) => {
        var _this = this;
        var driveImages = _this.state.drive.complete_images;
        driveImages.splice(index, 1);
        var driveData = _this.state.drive;
        driveData.complete_images = driveImages;
        console.log(driveImages);
        _this.setState({ driveData: driveData });
    }


    render() {
        const driveData = this.state.drive;
        // const poc = (driveData && global.user.id == driveData.admin.admin_id);
        const poc = driveData ? Array.isArray(driveData.admin) ? driveData.admin.find((i) => i.admin_id == global.user.id) : global.user.id == driveData.admin.admin_id : null;

        return (
            <ScrollView style={styles.mainContainer}>
                <Loader loading={this.state.loading} />
                <View style={{ marginVertical: 15, marginHorizontal: 20 }}>

                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons name={'ios-arrow-round-back'} size={40} onPress={() => this.props.navigation.goBack()} />

                        <View style={{ marginLeft: 30 }}>
                            <Text style={[StyleApp.headerText]}>Active Drives</Text>
                            <Text style={[StyleApp.headerSubText]}>Check your drives hear</Text>
                        </View>
                    </View>

                    {this.state.drive &&

                        <DriveDetailView navigation={this.props.navigation}
                            screenProps={this.props.screenProps}
                            driveType={'MenuUpcomingDriveDetail'}
                            driveData={this.state.drive}
                            edit={this.editDrive} startDrive={this.startDrive}
                            removeRobin={this.removeRobin}
                            onRemoveDriveImage={this.onRemoveDriveImage}
                        />

                        // <View style={[styles.boxWithShadow, { backgroundColor: '#fff', padding: 10, borderWidth: 0, margin: 10, marginTop: 20 }]}>







                        //     <Fragment>
                        //         <Text style={[AppStyle.blackColor, AppStyle.boldFamily, AppStyle.text20]}>{driveData.drive_name}</Text>
                        //         <Text style={[AppStyle.text12, { textTransform: "uppercase" }]}>{moment(driveData.drive_date || driveData.date).format('DD MMMM YYYY')}</Text>

                        //     </Fragment>


                        //     <View style={{ marginVertical: 10 }}>
                        //         <View style={{ flex: 1, flexDirection: 'row' }}>
                        //             <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        //                 <Image source={require(`../../assets/images/place.png`)} />
                        //                 <Text style={{ flex: 1, marginLeft: 5 }}>{driveData.city_name}</Text>
                        //             </View>
                        //             <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                        //                 <Image source={require(`../../assets/images/place.png`)} />
                        //                 <Text style={{ marginLeft: 5, flex: 1 }}>{driveData.zone_name}</Text>
                        //             </View>
                        //         </View>
                        //         <View style={{ flexDirection: 'row', alignItems: 'center', width: "100%", marginVertical: 5 }}>
                        //             <Image source={require(`../../assets/images/file.png`)} />
                        //             <Text style={{ marginLeft: 5, flex: 1 }}>{driveData.drive_number}</Text>
                        //         </View>
                        //     </View>

                        //     <View style={{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: 'rgba(0,0,0,0.3)', justifyContent: 'space-between' }}>
                        //         <TouchableOpacity onPress={() => { this.setState({ isDrive: 0 }) }} >
                        //             <Text style={[AppStyle.mediumFont, AppStyle.text16, { top: 2, color: this.state.isDrive == 0 ? '#71c89e' : null, borderBottomWidth: this.state.isDrive == 0 ? 2 : 0, borderBottomColor: '#71c89e', fontSize: 16, paddingVertical: 5 }]}>{'Drive Details'}</Text>

                        //         </TouchableOpacity>
                        //         <TouchableOpacity onPress={() => { this.setState({ isDrive: 1 }) }} >
                        //             <Text style={[AppStyle.mediumFont, AppStyle.text16, { top: 2, color: this.state.isDrive == 1 ? '#71c89e' : null, borderBottomWidth: this.state.isDrive == 1 ? 2 : 0, borderBottomColor: '#71c89e', paddingVertical: 5, paddingLeft: 20 }]}>Robin Details</Text>
                        //         </TouchableOpacity>
                        //         <TouchableOpacity onPress={() => { this.setState({ isDrive: 2 }) }} >
                        //             <Text style={[AppStyle.mediumFont, AppStyle.text16, { top: 2, color: this.state.isDrive == 2 ? '#71c89e' : null, borderBottomWidth: this.state.isDrive == 2 ? 2 : 0, borderBottomColor: '#71c89e', paddingVertical: 5, paddingLeft: 20 }]}>Map</Text>
                        //         </TouchableOpacity>
                        //     </View>


                        //     {this.state.isDrive == 0 && <Fragment>

                        //         <View style={{ padding: 10 }}>
                        //             <View style={{ marginVertical: 10 }}>
                        //                 <Text>Drive Number</Text>
                        //                 <Text style={[AppStyle.boldFamily]}>{driveData.drive_number}</Text>
                        //             </View>
                        //             <View style={{ marginVertical: 10 }}>
                        //                 <Text>Drive Description</Text>
                        //                 <Text style={[AppStyle.boldFamily]}>{driveData.description}</Text>
                        //             </View>
                        //             <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        //                 <View style={{ flex: 1 }} >
                        //                     <Text style={[AppStyle.text12, { backgroundColor: '#fff' }]}>Food Quantity</Text>
                        //                     <Text style={[AppStyle.boldFamily]}>{driveData.food_quntity}</Text>
                        //                 </View>
                        //                 <View style={{ flex: 1.5 }}>
                        //                     <Text style={[AppStyle.text12]}>Robins</Text>
                        //                     <Text style={[AppStyle.boldFamily]}>{driveData.no_of_volunteers}</Text>
                        //                 </View>
                        //             </View>
                        //             <View style={{ marginVertical: 10 }}>
                        //                 <Text style={[AppStyle.text12]}>Doner</Text>
                        //                 <Text style={[AppStyle.boldFamily, AppStyle.pramaryColor]}>{driveData.donar_name}</Text>
                        //             </View>
                        //             <View style={{ flexDirection: 'row' }}>
                        //                 <Text style={[AppStyle.text12, AppStyle.semiBoldFamily]}>Note : </Text>
                        //                 <Text style={[AppStyle.regularFont]}>Drive will not be calculated if drive is canceled.</Text>
                        //             </View>


                        //         </View>



                        //     </Fragment>}

                        //     {this.state.isDrive == 1 &&
                        //         <Fragment>
                        //             <View style={{ marginTop: 10, padding: 10 }}>

                        //                 <View style={{ marginTop: 10 }}>
                        //                     <Text>Robin (Admin)</Text>



                        //                     { Array.isArray(driveData.admin) &&  driveData.admin.map((admin, index) => {
                        //             return (
                        //                 <View key={index + ""} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        //                     <Image style={[styles.iconImage]} source={CommonUtil.getUserImage(admin.image_url)} />
                        //                     <Text style={[AppStyle.semiBoldFamily, StyleApp.font12, { marginLeft: 5 }]}>{admin.admin_name}</Text>
                        //                 </View>
                        //             );
                        //         })}
                        //         {typeof driveData.admin == "object" &&
                        //             <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        //                 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        //                     <Image style={[styles.iconImage]} source={CommonUtil.getUserImage(driveData.admin.image_url)} />
                        //                     <Text style={[AppStyle.boldFamily, { marginLeft: 5 }]}>{driveData.admin.admin_name}</Text>
                        //                 </View>

                        //             </View>
                        //         }

                        //                 </View>
                        //                 <View style={{ marginTop: 10 }}>
                        //                     <Text>Robin</Text>


                        //                     {driveData.robins.map((robin, index) => {
                        //                         return (
                        //                             <View key={"" + index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        //                                 <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        //                                     <Image style={[styles.iconImage]} source={CommonUtil.getUserImage(robin.image_url)} />
                        //                                     <Text style={[AppStyle.boldFamily, { marginLeft: 5 }]}>{robin.name}</Text>
                        //                                 </View>
                        //                                 {(global.user.type == "state_admin" || global.user.type == "city_admin" || poc) &&
                        //                                     <FeatherIcon size={25} name={'x'} color={AppStyle.grayColor.color} onPress={() => this.setState({ showRemoveRobin: true, selectedRobin: robin })} />
                        //                                 }
                        //                             </View>
                        //                         );
                        //                     })}
                        //                 </View>
                        //             </View>
                        //         </Fragment>
                        //     }


                        //     {this.state.isDrive == 2 &&
                        //         <Fragment>
                        //             <View style={{ marginTop: 10, padding: 10 }}>
                        //                 <View>

                        //                     <Map style={styles.map} data={driveData} />

                        //                 </View>
                        //                 <View style={{ marginTop: 10 }}>
                        //                     <View style={{ flex: 1 }}>
                        //                         <Text style={[AppStyle.text12,]}>Doner Name</Text>
                        //                         <Text style={[AppStyle.text14, AppStyle.boldFamily]}>{driveData.donar_name}</Text>
                        //                     </View>

                        //                     <View style={{ flex: 1, flexDirection: 'row', marginVertical: 10 }}>
                        //                         <View style={{ flex: 1 }}>
                        //                             <Text style={[AppStyle.text12,]}>Contact Person</Text>
                        //                             <Text style={[AppStyle.text14, AppStyle.boldFamily]}>{driveData.contact_person}</Text>
                        //                         </View>
                        //                         <View style={{ flex: 1 }}>
                        //                             <Text style={[AppStyle.text12,]}>Person Designation</Text>
                        //                             <Text style={[AppStyle.text14, AppStyle.boldFamily]}>{driveData.person_designation}</Text>
                        //                         </View>
                        //                     </View>

                        //                     <View style={{ flex: 1, flexDirection: 'row', marginVertical: 10 }}>
                        //                         <View style={{ flex: 1 }}>
                        //                             <Text style={[AppStyle.text12,]}>Contact Number</Text>
                        //                             <Text style={[AppStyle.text14, AppStyle.boldFamily]}>{driveData.person_mobile_number}</Text>
                        //                         </View>
                        //                         <View style={{ flex: 1 }}>
                        //                             <Text style={[AppStyle.text12,]}>Contact Email</Text>
                        //                             <Text style={[AppStyle.text14, AppStyle.boldFamily]}>{driveData.person_email}</Text>
                        //                         </View>
                        //                     </View>
                        //                 </View>
                        //             </View>
                        //         </Fragment>
                        //     }


                        //     {(global.user.type == "state_admin" || global.user.type == "city_admin" || poc) &&
                        //         <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        //             <TouchableOpacity style={[{ left: "10%", marginTop: 20, height: 44, paddingHorizontal: 30, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, AppStyle.primaryBackgroundColor]}
                        //                 onPress={() => this.props.navigation.navigate('CompleteDrive', { drive: driveData })}
                        //             >
                        //                 <Text style={{ color: '#fff', textTransform: 'uppercase', fontFamily: 'Montserrat-SemiBold' }}>COMPLETE</Text>
                        //             </TouchableOpacity>

                        //             <TouchableOpacity style={{ left: "10%", marginTop: 20, height: 44, paddingHorizontal: 30, borderRadius: 22, backgroundColor: '#efefef', alignItems: 'center', justifyContent: 'center' }}
                        //                 onPress={() => this.setState({ showCancelPopup: true })}>
                        //                 <Text style={{ color: '#000', textTransform: 'uppercase', fontFamily: 'Montserrat-SemiBold' }}>CANCEL</Text>
                        //             </TouchableOpacity>
                        //         </View>
                        //     }

                        //     {(global.user.type == "state_admin" || global.user.type == "city_admin" || poc) &&
                        //         <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>

                        //             {((poc && driveData.status == 0 || driveData.status == 2) || (global.user.type == "state_admin" || global.user.type == "city_admin")) &&
                        //                 <TouchableOpacity style={[{ left: "10%", marginTop: 20, height: 44, paddingHorizontal: 30, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: StyleApp.grayColor.color },]}
                        //                     onPress={this.edit}
                        //                 >
                        //                     <Text style={{ color: '#fff', textTransform: 'uppercase', fontFamily: 'Montserrat-SemiBold' }}>Edit</Text>
                        //                 </TouchableOpacity>
                        //             }
                        //             {driveData.status == 0 && <TouchableOpacity style={{  left: "10%",marginTop: 20, height: 44, paddingHorizontal: 30, borderRadius: 22, backgroundColor: StyleApp.primaryColor.color, alignItems: 'center', justifyContent: 'center' }}
                        //                 onPress={this.startDrive}>
                        //                 <Text style={{ color: '#fff', textTransform: 'uppercase', fontFamily: 'Montserrat-SemiBold' }}>Start</Text>
                        //             </TouchableOpacity>
                        //             }
                        //         </View>
                        //     }
                        //     { (global.user.type == "volunteer"  && !poc) &&
                        //             <TouchableOpacity style={[{ marginTop: 20, height: 44, paddingHorizontal: 30, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: AppStyle.darkGrayColor.color },]}
                        //                 onPress={() => this.setState({ leaveDrive: true })}
                        //             >
                        //                 <Text style={{ color: '#fff', textTransform: 'uppercase', fontFamily: 'Montserrat-SemiBold' }}>Leave ME</Text>
                        //             </TouchableOpacity>

                        //     } 
                        // </View>


                    }


                </View>

                {this.state.showCancelPopup &&

                    <CancelDrive driveData={driveData} showModal={this.state.showCancelPopup} onClose={(isCancel) => {
                        if (isCancel) {
                            this.props.navigation.goBack();
                            this.props.screenProps.eventEmitter.emit('ViewUpdate', { count: 1 });
                        }


                        this.setState({ showCancelPopup: false });
                    }} />
                }

                {this.state.showRemoveRobin &&
                    <RemoveRobin showModal={this.state.showRemoveRobin} robin={this.state.selectedRobin} onClose={() => { this.setState({ showRemoveRobin: false }) }}

                        onRemove={(message) => this.removeRobin(message)}
                    />
                }



                {this.state.leaveDrive &&
                    <LeaveDrive showModal={this.state.leaveDrive} driveData={driveData} onClose={(isCancel) => {
                        if (isCancel) {
                            this.props.navigation.goBack();
                            this.props.screenProps.eventEmitter.emit('ViewUpdate', { count: 1 });
                        }
                        this.setState({ leaveDrive: false });
                    }}


                    />
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    iconImage: {
        height: 30,
        width: 30,
        borderRadius: 15

    },
    formContainer: {
        left: "10%",
        marginTop: 40
    },
    seperation: {
        width: '80%',
        height: 20,
        left: 40,
        marginTop: 30,
        alignItems: 'center'
    },
    inputContainer: {

        backgroundColor: 'rgba(250,250,254,1)', marginBottom: 10, width: '100%', fontFamily: 'Montserrat-Regular', fontSize: 14
    },
    boxWithShadow: {
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3
    },
    image: {
        height: 120,
        width: '100%',
    },
    map: {
        // ...StyleSheet.absoluteFillObject,
        borderRadius: 5,
        height: 200,
        width: '100%'
    },

});
