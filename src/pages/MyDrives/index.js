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
    FlatList,
    TouchableWithoutFeedback

} from 'react-native';
import moment from 'moment';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';


import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';

import { DriveListItem } from '../../components/DriveListItem';

import Loader from '../../components/Loader';

import Userservice from '../../services/Userservice';

import CommonUtil from '../../utils/CommonUtil';


export default class MyDrives extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isRecent: true
        };
        this.renderEmptyComponent =this.renderEmptyComponent.bind(this);
    }

    UNSAFE_componentWillMount = () => {
        this.setState({ loading: true });
        Userservice.getMyDrives().then((res) => {
            console.log(res);
            this.setState({
                loading: false, driveData: res.data, drives: CommonUtil.sortBy(res.data.data, {
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
                this.props.navigation.navigate('MyDriveDetail', {
                    drive: drive
                });
            }} />
        );
    }


    renderEmptyComponent = () => {
        if (this.state.loading == false)
            return (<View style={[{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 5, margin:5, padding: 20 }, AppStyle.boxWithShadow]}>
                <Text>No any drives.</Text>
            </View>)
        return null;
    }



    render() {
        return (
            <ScrollView style={styles.mainContainer}>
                <Loader loading={this.state.loading} />
                <View style={{ marginHorizontal: 20, marginVertical: 15, }}>

                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons name={'ios-arrow-back'} size={30} onPress={() => this.props.navigation.goBack()} />

                        <View style={{ marginLeft: 30 }}>

                            <Text style={[StyleApp.headerText]}>My Drives</Text>
                            <Text style={[StyleApp.headerSubText]}>Check all your drives hear</Text>
                        </View>
                    </View>

                    {this.state.driveData &&
                        <Fragment>

                            <View style={{ flex: 1, marginVertical: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flex: 1, backgroundColor: '#efefef', padding: 20, borderRadius: 8, marginHorizontal: 10 }}>
                                    <Text style={[AppStyle.semiBoldFamily,StyleApp.darkGrayColor,StyleApp.font12, { textAlign: 'center' }]}>Total Drive</Text>
                                    <Text style={[StyleApp.lightFont,StyleApp.darkGrayColor, { fontSize: 24, textAlign: 'center' }]}>{this.state.driveData.total_drive}</Text>
                                </View>
                                <View style={{ flex: 1, backgroundColor: '#efefef', padding: 20, borderRadius: 8, marginHorizontal: 10 }}>

                                    <Text  style={[AppStyle.semiBoldFamily,StyleApp.darkGrayColor,StyleApp.font12, { textAlign: 'center' }]}>Completed Drive</Text>
                                    <Text style={[StyleApp.lightFont,StyleApp.darkGrayColor, { fontSize: 24, textAlign: 'center' }]}>{this.state.driveData.complete_drive}</Text>
                                </View>
                            </View>

                            <View style={{ marginLeft: 10 }}>

                                <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10 }}>
                                    <TouchableOpacity onPress={() => { this.setState({ isRecent: true }) }} style={{ top: 2 }}>
                                        <Text style={[AppStyle.semiBoldFamily, AppStyle.text14, { color: this.state.isRecent ? StyleApp.primaryColor.color : null, borderBottomWidth: 2, borderBottomColor: this.state.isRecent ? StyleApp.primaryColor.color : "#fff", paddingVertical: 5 }]}>{'Recent'}</Text>

                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.setState({ isRecent: false }) }} style={{ top: 2 }}>
                                        <Text style={[AppStyle.semiBoldFamily, AppStyle.text14, { color: !this.state.isRecent ? StyleApp.primaryColor.color : null, borderBottomWidth: 2, borderBottomColor: !this.state.isRecent ? StyleApp.primaryColor.color : "#fff", paddingVertical: 5, marginLeft: 20 }]}>{'Older'}</Text>
                                    </TouchableOpacity>
                                </View>

                                <FlatList
                                    data={!this.state.isRecent ? this.state.drives : this.state.drives.slice(0, 5)}
                                    renderItem={this.renderItem.bind(this)}
                                    keyExtractor={item => "" + item.drive_id}
                                    ListEmptyComponent={this.renderEmptyComponent}

                                />

                            </View>
                        </Fragment>
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
    },
    boxWithShadow: {
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3
    }


});
