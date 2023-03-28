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
import Ionicons from 'react-native-vector-icons/Ionicons';
import StyleApp from '../../style/NewAppStyle'

import AppStyle from '../../style/AppStyle';
import Loader from '../../components/Loader';
import DriveDetailView from '../../components/DriveDetailView';
import DriveService from '../../services/DriveService';
import Userservice from '../../services/Userservice';
import { relativeTimeThreshold } from 'moment';
export default class UpcomingDriveDetail extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            routeName: this.props.navigation.state.routeName
        };
        this.joinDrive = this.joinDrive.bind(this);
        this.acceptDrive = this.acceptDrive.bind(this);
        this.rejectDrive = this.rejectDrive.bind(this);
        this.driveUpdateListener = this.driveUpdateListener.bind(this);
    }


    UNSAFE_componentWillMount() {

        // this.getData();

        // this.eventEmitter = this.props.screenProps.eventEmitter;
        // if (!this.eventEmitter.listeners('DriveUpdate').length) {
        //     this.eventEmitter.addListener('DriveUpdate', this.driveUpdateListener);
        // }
        this.setState({loading:true});
        this.props.navigation.addListener("didFocus", async () => {
            this.getData();

        });

    }

    componentWillUnmount() {
        // this.eventEmitter.removeListener('DriveUpdate', this.driveUpdateListener);
    }

    driveUpdateListener(data) {
        var _this = this;
        _this.setState({
            driveData: undefined,
        });
        _this.getData();
    }


    getData = () => {

        this.driveParam = this.props.navigation.getParam('drive', null);

        let driveId = this.driveParam.drive_id || this.driveParam.id;
        
        Promise.all([
            DriveService.getUpcomingDriveById(driveId),
            DriveService.getUserJoinDriveStatus(driveId)
        ])
            .then((res) => {
                console.log(res);

                var drive = res[0].data;
                drive.joinStatus = res[1].data;
                this.setState({ loading: false, drive: drive });
                //this.setState({ drives: res.data });
            }).catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });
    }

    joinDrive(reasonId) {
        let _this = this;
        const { drive } = this.state;
        let driveId = this.driveParam.drive_id || this.driveParam.id;
        this.setState({ loading: true });

        DriveService.joinDrive(driveId, reasonId).then((res) => {
            console.log(res);
            var drive = this.state.drive;
            drive.joinStatus = res.data;

            this.setState({ loading: false, drive: drive });
            //this.setState({ drives: res.data });
        }).catch((error) => {
            this.setState({ loading: false });
            console.log(error);
        });
    }

    acceptDrive() {
        let _this = this;
        console.log(_this.driveParam);
        let driveId = _this.driveParam.drive_id || _this.driveParam.id;
        this.setState({ loading: true });

        Userservice.acceptDrive(driveId).then((res) => {
            console.log(res);

            this.setState({ loading: false });
            this.props.screenProps.alert({
                title: 'Robinhood',
                body: this.state.drive.drive_name + ' drive accept successfully.',
            });
            this.props.screenProps.eventEmitter.emit('ViewUpdate', { count: 1 });
            this.props.navigation.goBack();

            //this.setState({ drives: res.data });
        }).catch((error) => {
            this.setState({ loading: false });
            console.log(error);
        });
    }


    rejectDrive() {



        let _this = this;
        const { drive } = this.state;
        let driveId = this.driveParam.drive_id || this.driveParam.id;
        this.setState({ loading: true });

        Userservice.rejectDrive(driveId).then((res) => {
            console.log(res);

            this.setState({ loading: false });

            this.props.screenProps.alert({
                title: 'Robinhood',
                body: this.state.drive.drive_name + ' drive rejecte by you.',
            });
            this.props.navigation.goBack();
            //this.setState({ drives: res.data });
        }).catch((error) => {
            this.setState({ loading: false });
            console.log(error);
        });
    }


    startDrive = () => {
        this.setState({ loading: true });
        let driveId = this.driveParam.drive_id || this.driveParam.id
        Userservice.startDrive(driveId).then((res) => {
            console.log(res);
            this.props.screenProps.eventEmitter.emit('ViewUpdate', { count: 1 });
            this.setState({ loading: false });

            this.props.screenProps.alert({
                title: 'Robinhood',
                body: this.state.drive.drive_name + ' drive start.',
            });
           

           this.props.navigation.goBack();
        }).catch((error) => {
            this.setState({ loading: false });
            console.log(error);
        });
    }

    editDrive = () => {
        const driveDetail = this.state.drive;

        var ids = new Set(driveDetail.invite_peoples.map(d => d.id));
        var merged = [...driveDetail.invite_peoples, ...driveDetail.robins.filter(d => !ids.has(d.id))];

        let data = {
            "user_id": driveDetail.user_id,
            "name": driveDetail.drive_name,
            "invite_peoples": merged,
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


        this.props.navigation.navigate('MenuConfirmDrive', {
            drive: data
        });
    }

    removeRobin = (robinId) => {
        var _this = this;
        var robins = _this.state.drive.robins.filter((item) => item.id != robinId);
        var driveData = _this.state.drive;
        driveData.robins = robins;
        _this.setState({ driveData: driveData });
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
        const header = this.props.navigation.getParam('header', null);
        return (
            <ScrollView style={styles.mainContainer}>
                <Loader loading={this.state.loading} />
                <View style={{ marginHorizontal: 20, marginVertical: 15, }}>

                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons name={'ios-arrow-round-back'} size={40} onPress={() => this.props.navigation.goBack()} />

                        <View style={{ marginLeft: 30 }}>


                            <Text style={[StyleApp.headerText]}>{header ? header.title : 'Upcoming Drives'}</Text>
                            <Text style={[StyleApp.headerSubText]}>{header ? header.subTitle : 'Enroll to participate in upcoming drives'}</Text>

                        </View>
                    </View>

                    {this.state.drive &&
                        <DriveDetailView navigation={this.props.navigation}
                            screenProps={this.props.screenProps}
                            driveType={this.state.routeName || 'upcomingdrive'}
                            driveData={this.state.drive} joinDrive={this.joinDrive}

                            accept={this.acceptDrive} reject={this.rejectDrive}
                            edit={this.editDrive} startDrive={this.startDrive}

                            removeRobin={this.removeRobin}
                            onRemoveDriveImage={this.onRemoveDriveImage}
                        />
                    }



                </View>

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
