import React, { Component, Profiler, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    ScrollView,
    Dimensions,
    Image,
    TouchableWithoutFeedback
} from 'react-native';

import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';

import DriveService from '../../services/DriveService';
import SectionHeader from '../../components/SectionHeader';

export default class FoodDonationDrive extends Component {



    constructor(props) {
        super(props);
        this.state = {};
    }


    UNSAFE_componentWillMount() {

        DriveService.getFoodDonationDrive().then((res) => {
            this.setState({
                foodDonationDrive: res.data,
            });

        }).catch((error) => {
            console.log(error);
        })

    }



    render() {
        if (!this.state.foodDonationDrive)
            return null;
        return (
            <View>
                 <SectionHeader title="Next Food Donation Drive" action="Show More" onPressAction={() => {
                        this.props.navigation.navigate('NextFoodDonationList');
                    }} />
                
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginLeft: 10 }} >

                    {this.state.foodDonationDrive.map((drive) => {
                        const driveImage = (drive.image) ? { uri: drive.image}:require('../../assets/images/app_icon.png');

                        return (

                            <TouchableWithoutFeedback key={drive.id} onPress={() => {
                               this.props.navigation.navigate('UpcomingDriveDetail', {
                                header:{
                                    title:'Food Donation Drive',
                                    subTitle:'Check all next donation drives hear'
                                                        },
                                    drive: drive
                                });
                            }}>
                                <View style={[styles.boxWithShadow, { flexDirection: 'row', marginVertical: 10, backgroundColor: '#fff', borderRadius: 10, marginHorizontal: 10 }]}>
                                 
<Image source={driveImage} style={[{ height: 100, width: 100, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }]} />
                                    
                                    <View style={[{ marginHorizontal: 10, paddingVertical: 10 ,justifyContent:'space-between'}]}>
                                        <Text style={[StyleApp.mediumFont,AppStyle.blackColor,AppStyle.text14]}>{drive.name}</Text>
                                        <Text style={[StyleApp.regularFont, AppStyle.grayColor, { fontSize: 12, maxWidth: 180 }]}>{drive.description}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                            <View style={[{ width: 25, height: 25,  borderRadius: 12, justifyContent: 'center' },StyleApp.primaryBackgroundColor]}><Text style={[AppStyle.whiteColor,AppStyle.semiBoldFamily, AppStyle.textCenter, AppStyle.text10]}>{drive.no_of_volunteers}</Text></View>
                                            <Text style={[StyleApp.regularFont, { fontSize: 10, marginLeft: 5 }]}>People joined to Army</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>)
                    })}

                </ScrollView>
            </View>



        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    iconImage: {

        width: 70,
        height: 70,
        borderRadius: 35,
        borderColor: '#71c89e',
        borderWidth: 0.75

    },
    formContainer: {
        left: "10%",
        marginTop: 20
    },


    avtarImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    boxWithShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 4
    }


});



