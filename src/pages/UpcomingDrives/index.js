import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    FlatList
} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStyle from '../../style/AppStyle';
import Loader from '../../components/Loader';
import { DriveListItem } from '../../components/DriveListItem';
import DriveService from '../../services/DriveService';
import CommonUtil from '../../utils/CommonUtil';
import StyleApp from '../../style/NewAppStyle'

export default class UpcomingDrives extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userType: null,
            drives: [
            ]

        };

        this.driveUpdateListener = this.driveUpdateListener.bind(this);


    }


    


    UNSAFE_componentWillMount() {

        this.getData();

        this.eventEmitter = this.props.screenProps.eventEmitter;

        if (!this.eventEmitter.listeners('ViewUpdate').length) {
            this.eventEmitter.addListener('ViewUpdate', this.driveUpdateListener);
        }

    }

    componentWillUnmount() {
        this.eventEmitter.removeListener('ViewUpdate', this.driveUpdateListener);
    }

    driveUpdateListener(data) {
        var _this = this;
        _this.setState({
            driveData: undefined,
        });
        _this.getData();
    }

    getData() {
        this.setState({ loading: true });
        DriveService.getUpcomingDrive().then((res) => {
            console.log(res);

            this.setState({
                loading: false, drives: CommonUtil.sortBy(res.data, {
                    prop: "date",
                    desc: true,
                    parser: function (item) { return new Date(item); }
                })
            });

        }).catch((error) => {
            this.setState({ loading: false });
            console.log(error);
        });
    }



    renderItem = (item) => {


        const drive = item.item;

        const privousDrive = item.index > 0 ? this.state.drives[item.index - 1] : item.item;

        let isNotSameMonth = (item.index == 0 || moment(drive.date).format('MM') !== moment(privousDrive.date).format('MM'));
        return (
            <DriveListItem isNotSameMonth={isNotSameMonth} drive={drive} onPress={() => {
                this.props.navigation.navigate('MenuUpcomingDriveDetail', {
                    drive: drive
                });
            }} />
        )
    }



    render() {
        return (
            <ScrollView style={styles.mainContainer}>
                <Loader loading={this.state.loading} />
                <View style={{ marginHorizontal: 20 }}>


                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <Ionicons name={'ios-arrow-round-back'} size={40} onPress={() => this.props.navigation.goBack()} />

                        <View style={{ marginLeft: 20 }}>
                            <Text style={[StyleApp.headerText]}>{'Upcoming Drives'}</Text>
                            <Text style={[StyleApp.headerSubText]}>{'Enroll to participate in upcoming drives'}</Text>


                        </View>
                    </View>

                    <Image source={require(`../../assets/images/help_serve_2.png`)} style={{ width: "100%", height: 120 }} resizeMode={'stretch'} />



                    <FlatList
                        data={this.state.drives}
                        renderItem={this.renderItem.bind(this)}
                        keyExtractor={item => "" + item.id}
                        ListEmptyComponent={
                            <View style={[{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 5, margin: 10, padding: 20 }, AppStyle.boxWithShadow]}>
                                <Text>No any upcoming drives.</Text>
                            </View>
                        }
                    />
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
        height: 80,
        width: 80,

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
    }


});
