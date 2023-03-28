import React, { Component } from 'react';
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
    ActivityIndicator,
    PermissionsAndroid
} from 'react-native';

import AppStyle from '../../style/AppStyle';

import RobinService from '../../services/RobinService';

export default class RecentCompleted extends Component {



    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showDrivePopup: false
        };
    }

    UNSAFE_componentWillMount = () => {

        RobinService.newRequestRobin().then((res) => {
        console.log("New Robin Request", res);

        this.setState({
            robinRequests: res.data,
        });

    }).catch((error) => {
        console.log(error);
    });


    }


    render() {
        if (!this.state.robinRequests)
            return null;
        return (
            <View style={{ marginHorizontal: 0 }}>
                <View style={{ marginHorizontal: 20, flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' }}>
                    <Text style={[AppStyle.mediumFont,AppStyle.blackColor, { fontSize: 16 }]}>New Robins Requests</Text>
                    <Text style={[AppStyle.regularFont, AppStyle.grayColor,AppStyle.text12]}>Show More</Text>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingLeft: 10 }} >

                    {this.state.robinRequests.map((robin) => {
                        return (
                            <View key={robin.user_id} style={[{ margin: 10, padding: 10, backgroundColor: '#fff', borderRadius: 10 }, styles.boxWithShadow]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={[AppStyle.mediumFont, { fontSize: 14 }]}>{robin.firstname} {robin.lastname}</Text>

                                    </View>
                                    <View style={{ alignItems: 'center', marginHorizontal: 10, borderRadius: 50 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[AppStyle.regularFont, { fontSize: 10 }]}>Status</Text>
                                            <Text style={[AppStyle.mediumFont, { fontSize: 10, marginLeft: 10, backgroundColor: '#fbf7e4', color: '#d2b756', paddingHorizontal: 10, borderRadius: 10 }]}>{robin.status}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={require(`../../assets/images/user_male.png`)} style={[{ width: 50, height: 50, borderRadius: 25 }]} />
                                    </View>
                                    <View style={{ marginHorizontal: 10 }}>
                                        <Text style={[AppStyle.mediumFont, AppStyle.grayColor, { fontSize: 12 }]}>MOBILE</Text>
                                        <Text style={[AppStyle.mediumFont, AppStyle.grayColor, { fontSize: 12 }]}>{robin.phone}</Text>

                                    </View>
                                    <View style={{ padding: 5 }}>
                                        <Text style={[AppStyle.mediumFont, AppStyle.grayColor, { fontSize: 12 }]}>ZONE</Text>
                                        <Text style={[AppStyle.mediumFont, AppStyle.grayColor, { fontSize: 12 }]}>{robin.zone.name}</Text>
                                        <Text style={[AppStyle.mediumFont, AppStyle.grayColor, { fontSize: 8 }]}>{robin.city.name} | {robin.state.name} | {robin.country.name}</Text>

                                    </View>
                                </View>
                            </View>
                        )
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
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3
    }


});
