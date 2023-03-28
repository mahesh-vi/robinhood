import React, { Component } from 'react';
import { View, StatusBar, Alert, StyleSheet, Image, Modal, Text, TextInput, TouchableOpacity, Platform, FlatList, ScrollView } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStyle from '../style/AppStyle';
import RobinService from '../services/RobinService';


export default class TopRobins extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    UNSAFE_componentWillMount = () => {
        let _this = this;
        RobinService.getTopRobins().then((res) => {
            console.log("Get Drive list", res);
            _this.setState({ topRobins: res.data });
        });
    }


    render() {

        return (
            <View style={{ marginVertical: 10 }}>
                <View style={{ marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[AppStyle.mediumFont, AppStyle.blackColor, AppStyle.text16]}>Top Robins</Text>
                    <Text style={[AppStyle.regularFont, AppStyle.grayColor]}>Show More</Text>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10 }} >
                    {
                        this.state.topRobins && this.state.topRobins.map((robin, index) => {

                            const robinImage = (robin.image_url) ? { uri: robin.image_url } : require('../assets/images/user_male.png');
                            return (<View key={"" + index} style={[{ margin: 10, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#fff', borderRadius: 10 }, styles.boxWithShadow]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 80, minWidth: 220 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={robinImage} style={[{ width: 45, height: 45, borderRadius: 22 }]} />
                                    </View>
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={[AppStyle.blackColor, AppStyle.semiBoldFamily, AppStyle.text12]}>{robin.firstname} {robin.lastname}</Text>
                                        <View style={{ backgroundColor: '#000000', alignSelf: 'flex-start', marginTop: 2 }}>
                                            <Text style={[AppStyle.boldFamily, AppStyle.text10, AppStyle.whiteColor, { textAlign: 'center', backgroundColor: AppStyle.cyanColor.color, paddingHorizontal: 5 }]}>142 Successful Drive</Text>
                                        </View>

                                    </View>
                                </View>

                            </View>)
                        })
                    }


                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: '#79d0aa',
        marginTop: (Platform.OS) === 'ios' ? 20 : 0,
    },
    avtarImage: {

        width: 35,
        height: 35,
        borderRadius: 20


    },
    boxWithShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 3
    }
});





{/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={[AppStyle.mediumFont, { fontSize: 14 }]}>{robin.firstname} {robin.lastname}</Text>
    
                                    </View>
    
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image source={require(`../assets/images/avtar.png`)} style={[{ width: 50, height: 50, borderRadius: 25 }]} />
                                    </View>
                                    <View style={{ marginHorizontal: 10 }}>
                                        <Text style={[AppStyle.mediumFont, AppStyle.grayColor, { fontSize: 12 }]}>MOBILE</Text>
                                        <Text style={[AppStyle.mediumFont, AppStyle.grayColor, { fontSize: 12 }]}>{robin.phone}</Text>    
                                    </View>
                                    <View style={{ padding: 5 }}>
                                        <Text style={[AppStyle.mediumFont, AppStyle.grayColor, { fontSize: 12 }]}>ZONE</Text>
                                        <Text style={[AppStyle.mediumFont, AppStyle.grayColor, { fontSize: 12 }]}>{robin.zone}</Text>
                                        <Text style={[AppStyle.mediumFont, AppStyle.grayColor, { fontSize: 8 }]}>{robin.city} | {robin.state} | {robin.country}</Text>
    
                                    </View>
                                </View> */}