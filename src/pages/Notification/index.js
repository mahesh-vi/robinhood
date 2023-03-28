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
    FlatList

} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AppStyle from '../../style/AppStyle';
import Userservice from '../../services/Userservice';
import StyleApp from '../../style/NewAppStyle';

const Status = [
    '',
    'Confirm Drive',
    'Approve Drive',
    'Drive Canceled',
    'Drive Accepted',
    'Drive Rejected'
];
export default class Notification extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    UNSAFE_componentWillMount() {
        this.props.navigation.addListener("didFocus", async () => {
            Userservice.getUserNotification().then((res) => {
                console.log(res);
                this.setState({ notifications: res.data.data });


            }).catch((error) => {
                console.log(error);
            });
        });
    }

    onClickNotification = (notification) => {
        console.log(notification);
        if (notification.type_id == 1 || notification.type_id == 3) {
            this.props.navigation.navigate('MenuUpcomingDriveDetail', {
                drive: notification
            })
        } else if (notification.type_id == 2) {
            this.props.navigation.navigate('MyUpcomingDriveDetail', {
                drive: notification
            });
        }
    }

    renderItem = (item) => {

        const notification = item.item;

        const privousNotification = item.index > 0 ? this.state.notifications[item.index - 1] : item.item;

        let isNotSameMonth = (item.index == 0 || moment(notification.date).format('MM') !== moment(privousNotification.date).format('MM'));
        if (notification.type_id !== 4) {

            return (<View style={{ marginVertical: 5, width: '100%' }} >
                {isNotSameMonth &&
                    <View style={{ backgroundColor: '#000000', alignSelf: 'flex-start', marginVertical: 10 }}>
                        <Text style={[AppStyle.boldFamily, AppStyle.text10, AppStyle.whiteColor, { textAlign: 'center', backgroundColor: AppStyle.cyanColor.color, textTransform: 'uppercase', paddingHorizontal: 5 }]}>{moment(notification.date).format('MMMM')}</Text>
                    </View>

                }
                <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[AppStyle.semiBoldFamily, { fontSize: 12, textTransform: 'uppercase' }]}>{moment(notification.date).format('ddd')}</Text>
                        <Text style={[AppStyle.mediumFont, { fontSize: 22 }]}>{moment(notification.date).format('DD')}</Text>
                        <Text style={[AppStyle.boldFamily, { fontSize: 12, textTransform: 'uppercase' }]}>{moment(notification.date).format('MMM')}</Text>

                    </View>

                    <TouchableOpacity style={[styles.boxWithShadow, {
                        flex: 1, marginHorizontal: 10, padding: 10, paddingVertical: 20, flexDirection: 'row', alignItems: 'center',
                        backgroundColor: '#fff', justifyContent: 'space-between',
                        borderLeftWidth: 5, borderRadius: 5, borderLeftColor: (notification.type_id == 3 || notification.type_id == 5 ) ? '#c02424' : '#74c875',
                    }]} onPress={() => this.onClickNotification(notification)}>
                        <View style={{ width: '60%' }} >

                            <Text style={[AppStyle.semiBoldFamily, StyleApp.blackColor, { fontSize: 14, marginVertical: 2 }]}>{notification.title}</Text>
                            <Text style={[AppStyle.regularFont, StyleApp.grayColor, { fontSize: 10, marginVertical: 2 }]}>{notification.description}</Text>
                        </View>

                        <View style={{ backgroundColor: (notification.type_id == 3 || notification.type_id == 5 || notification.drive_status == "3") ? '#f8e4e4' : '#edf9f0', borderRadius: 10, paddingHorizontal: 5 }}>

                            <Text style={[AppStyle.semiBoldFamily, StyleApp.font12, { color: (notification.type_id == 3 || notification.type_id == 5 ) ? '#c02424' : '#74c875', marginVertical: 2 }]}>{notification.drive_status == "3" ? "Drive Canceled" : Status[notification.type_id]}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>);
        }
        else if (notification.type_id == 4) {
            return (
                <View style={{ marginVertical: 5, width: '100%' }} >
                    {isNotSameMonth &&
                        <View style={{ backgroundColor: '#000000', alignSelf: 'flex-start', marginVertical: 10 }}>
                            <Text style={[AppStyle.boldFamily, AppStyle.text10, AppStyle.whiteColor, { textAlign: 'center', backgroundColor: AppStyle.cyanColor.color, textTransform: 'uppercase', paddingHorizontal: 5 }]}>{moment(notification.date).format('MMMM')}</Text>
                        </View>

                    }
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={[AppStyle.semiBoldFamily, { fontSize: 12, textTransform: 'uppercase' }]}>{moment(notification.date).format('ddd')}</Text>
                            <Text style={[AppStyle.mediumFont, { fontSize: 22 }]}>{moment(notification.date).format('DD')}</Text>
                            <Text style={[AppStyle.boldFamily, { fontSize: 12, textTransform: 'uppercase' }]}>{moment(notification.date).format('MMM')}</Text>

                        </View>

                        <View style={[styles.boxWithShadow, {
                            flex: 1, marginHorizontal: 10, padding: 10, paddingVertical: 20, flexDirection: 'row', alignItems: 'center',
                            backgroundColor: AppStyle.cyanColor.color, justifyContent: 'space-between', borderRadius: 5,
                        }]}>

                            <View>
                                <Text style={[AppStyle.semiBoldFamily, AppStyle.whiteColor, { fontSize: 14, marginVertical: 2 }]}>{notification.title}</Text>
                                <Text style={[AppStyle.regularFont, AppStyle.whiteColor, { fontSize: 10, marginVertical: 2, }]}>{notification.description}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 5 }}>
                                <Text style={[AppStyle.mediumFont, { color: '#74c875', fontSize: 10, marginVertical: 2 }]}>Accepted</Text>
                            </View>

                        </View>


                    </View>
                </View>

            );
        }


        // else if (notification.status == 3) {
        //     return (
        //         <View style={{ marginVertical: 5, width: '100%' }} >
        //             {isNotSameMonth &&
        //                 <View style={{ backgroundColor: '#000000', alignSelf: 'flex-start', marginVertical: 10 }}>
        //                     <Text style={[AppStyle.boldFamily, AppStyle.text10, AppStyle.whiteColor, { textAlign: 'center', backgroundColor: AppStyle.cyanColor.color, textTransform: 'uppercase', paddingHorizontal: 5 }]}>{moment(notification.date).format('MMMM')}</Text>
        //                 </View>

        //             }
        //             <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>

        //                 <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        //                     <Text style={[AppStyle.semiBoldFamily, { fontSize: 12, textTransform: 'uppercase' }]}>{moment(notification.date).format('ddd')}</Text>
        //                     <Text style={[AppStyle.mediumFont, { fontSize: 22 }]}>{moment(notification.date).format('DD')}</Text>
        //                     <Text style={[AppStyle.boldFamily, { fontSize: 12, textTransform: 'uppercase' }]}>{moment(notification.date).format('MMM')}</Text>

        //                 </View>

        //                 <View style={[styles.boxWithShadow, {
        //                     flex: 1, marginHorizontal: 10, padding: 10, paddingVertical: 20, flexDirection: 'row', alignItems: 'center',
        //                     backgroundColor: '#23A393', justifyContent: 'space-between', borderRadius: 5,
        //                 }]}>

        //                     <View style={{ width: '65%' }} >
        //                         <Text style={[AppStyle.semiBoldFamily, AppStyle.whiteColor, { fontSize: 14, marginVertical: 2 }]}>{notification.title}</Text>
        //                         <Text style={[AppStyle.regularFont, AppStyle.whiteColor, { fontSize: 10, marginVertical: 2, marginLeft: 5 }]}>{notification.description}</Text>
        //                     </View>
        //                     <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 5 }}>
        //                         <FeatherIcon name={'check'} size={20} style={{ color: '#74c875' }} />

        //                         <Text style={[AppStyle.semiBoldFamily,StyleApp.font12, { color: '#74c875',  marginVertical: 2 }]}>{Status[notification.status]}</Text>
        //                     </View>

        //                 </View>


        //             </View>
        //         </View>

        //     );
        // }

        // else {




        //     return (



        //         <View style={{ marginVertical: 5, width: '100%' }} >

        //             {isNotSameMonth &&
        //                 <View style={{ backgroundColor: '#000000', alignSelf: 'flex-start', marginVertical: 10 }}>
        //                     <Text style={[AppStyle.boldFamily, AppStyle.text10, AppStyle.whiteColor, { textAlign: 'center', backgroundColor: AppStyle.cyanColor.color, textTransform: 'uppercase', paddingHorizontal: 5 }]}>{moment(notification.date).format('MMMM')}</Text>
        //                 </View>

        //             }

        //             <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#fff' }}>

        //                 <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        //                     <Text style={[AppStyle.semiBoldFamily, { fontSize: 12, textTransform: 'uppercase' }]}>{moment(notification.date).format('ddd')}</Text>
        //                     <Text style={[AppStyle.mediumFont, { fontSize: 22 }]}>{moment(notification.date).format('DD')}</Text>
        //                     <Text style={[AppStyle.boldFamily, { fontSize: 12, textTransform: 'uppercase' }]}>{moment(notification.date).format('MMM')}</Text>

        //                 </View>

        //                 <View style={[styles.boxWithShadow, {
        //                     flex: 1, marginHorizontal: 10, padding: 10, paddingVertical: 20, flexDirection: 'row', alignItems: 'center',
        //                     borderColor: '#74c875', backgroundColor: '#fff', justifyContent: 'space-between',
        //                     borderLeftWidth: 5, borderRadius: 5, borderLeftColor: '#74c875',
        //                 }]}>

        //                     <View style={{ width: '62%', }} >

        //                         <Text style={[AppStyle.semiBoldFamily,StyleApp.blackColor, { fontSize: 14, marginVertical: 2 }]}>{notification.title}</Text>
        //                         <Text style={[AppStyle.regularFont,StyleApp.grayColor, { fontSize: 10, marginVertical: 2, marginLeft: 5 }]}>{notification.description}</Text>
        //                     </View>
        //                     <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#edf9f0', borderRadius: 10, paddingHorizontal: 5 }}>
        //                         <FeatherIcon name={'check'} size={20} style={{ color: '#74c875' }} />

        //                         <Text style={[AppStyle.semiBoldFamily,StyleApp.font12,  { color: '#74c875',  marginVertical: 2 }]}>{Status[notification.status]}</Text>
        //                     </View>

        //                 </View>


        //             </View>
        //         </View>

        //     );
        // }

    }




    render() {
        return (
            <ScrollView style={styles.mainContainer}>

                <View style={{ marginHorizontal: 20, marginVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons name={'ios-arrow-back'} size={30} onPress={() => this.props.navigation.navigate('Dashboard')} />
                        <View style={{ marginLeft: 20 }}>
                            <Text style={[StyleApp.headerText]}>Notification</Text>
                            <Text style={[StyleApp.headerSubText]}>Get all your updates over here</Text>

                        </View>
                    </View>

                </View>

                <View style={{ marginHorizontal: 20 }}>
                    <FlatList
                        contentInsetAdjustmentBehavior="automatic"
                        data={this.state.notifications}
                        renderItem={this.renderItem.bind(this)}
                        keyExtractor={item => "" + item.id}
                        ListEmptyComponent={
                            <View style={[{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 5, margin: 10, padding: 20 }, AppStyle.boxWithShadow]}>
                                <Text>No any notification yet.</Text>
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

    boxWithShadow: {
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3
    }



});






// if (item.index % 3 == 0) {
//     return (
//         <View style={{ marginVertical: 5, width: '100%' }} >

//             <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>

//                 <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                     <Text style={[AppStyle.regularFont, { fontSize: 12,textTransform:'uppercase' }]}>{moment(notfication.date).format('ddd')}</Text>
//                     <Text style={[AppStyle.mediumFont, { fontSize: 16 }]}>20</Text>
//                     <Text style={[AppStyle.regularFont, { fontSize: 8 }]}>APR</Text>

//                 </View>

//                 <View style={[styles.boxWithShadow, {
//                     flex: 1, marginHorizontal: 10, padding: 10, paddingVertical: 20, flexDirection: 'row', alignItems: 'center',
//                     borderColor: '#74c875', backgroundColor: '#fff', justifyContent: 'space-between',
//                     borderLeftWidth: 5, borderRadius: 5, borderLeftColor: '#74c875'
//                 }]}>

//                     <View>
//                         <Text style={[AppStyle.semiBoldFamily, { fontSize: 14, marginVertical: 2 }]}>Bopal Zone - 3 Khichadi</Text>
//                         <Text style={[AppStyle.regularFont, { fontSize: 10, marginVertical: 2, marginLeft: 5 }]}>10:00 AM - 10:30AM</Text>
//                     </View>
//                     <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#edf9f0', borderRadius: 10, paddingHorizontal: 5 }}>
//                         <FeatherIcon name={'check'} size={20} style={{ color: '#74c875' }} />

//                         <Text style={[AppStyle.mediumFont, { color: '#74c875', fontSize: 10, marginVertical: 2 }]}>Accepted</Text>
//                     </View>

//                 </View>


//             </View>
//         </View>

//     );
// }
// else if (item.index % 3 == 1) {
//     return (
//         <View style={{ marginVertical: 5, width: '100%' }} >

//             <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>

//                 <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                     <Text style={[AppStyle.regularFont, { fontSize: 12 }]}>SAT</Text>
//                     <Text style={[AppStyle.mediumFont, { fontSize: 16 }]}>20</Text>
//                     <Text style={[AppStyle.regularFont, { fontSize: 8 }]}>APR</Text>

//                 </View>

//                 <View style={[styles.boxWithShadow, {
//                     flex: 1, marginHorizontal: 10, padding: 10, paddingVertical: 20, flexDirection: 'row', alignItems: 'center',
//                     backgroundColor: AppStyle.cyanColor.color, justifyContent: 'space-between', borderRadius: 5,
//                 }]}>

//                     <View>
//                         <Text style={[AppStyle.semiBoldFamily,AppStyle.whiteColor, { fontSize: 14, marginVertical: 2 }]}>Honest Extra Food</Text>
//                         <Text style={[AppStyle.regularFont,AppStyle.whiteColor, { fontSize: 10, marginVertical: 2, marginLeft: 5 }]}>5 Robins</Text>
//                     </View>
//                     <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 5 }}>
//                         <FeatherIcon name={'check'} size={20} style={{ color: '#74c875' }} />

//                         <Text style={[AppStyle.mediumFont, { color: '#74c875', fontSize: 10, marginVertical: 2 }]}>Appoved</Text>
//                     </View>

//                 </View>


//             </View>
//         </View>

//     );
// }

// else {
//     return (<View style={{ marginVertical: 5, marginLeft: 25,  marginRight: 10 }} >
//         <View style={{ flexDirection: 'row', backgroundColor: '#fff' }}>
//             <View style={[{ padding: 10, paddingVertical: 20,width:'100%',  flexDirection: 'row',justifyContent:'space-between', alignItems: 'center', backgroundColor: '#fff', marginLeft: 5, borderLeftWidth: 5, borderRadius: 5, borderLeftColor: '#c02424' }, styles.boxWithShadow]}>
//                 <View style={{width:'70%'}}>
//                     <Text style={[AppStyle.semiBoldFamily, { fontSize: 14, marginVertical: 2 }]}>Bopal Zone - 3 Khichadi</Text>
//                     <Text style={[AppStyle.regularFont, { fontSize: 10, marginVertical: 2, marginLeft: 5 }]}>10:00 AM - 10:30AM</Text>
//                 </View>
//                 {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', position: 'absolute', right: 10, borderRadius: 10, paddingHorizontal: 5 }}>
//                     <FeatherIcon name={'check'} size={20} style={{ color: '#74c875', backgroundColor: '#edf9f0', padding: 4, borderRadius: 15 }} />
//                     <FeatherIcon name={'x'} size={20} style={{ color: '#c02424', backgroundColor: '#f8e4e4', padding: 4, borderRadius: 15, marginLeft: 5 }} />
//                 </View> */}
//                 <View style={{  backgroundColor: '#f8e4e4', borderRadius: 10, paddingHorizontal: 5 }}>

//                         <Text style={[AppStyle.mediumFont, { color: '#c02424', fontSize: 10, marginVertical: 2 }]}>In-Complete</Text>
//                     </View>
//             </View>
//         </View>
//     </View>);
// }
// }
