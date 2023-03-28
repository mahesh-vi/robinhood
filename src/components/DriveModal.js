import React, { Component } from 'react';
import { View, StatusBar, Alert, StyleSheet, Image, Modal, Text, TouchableOpacity, Platform, TouchableWithoutFeedback } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AppStyle from '../style/AppStyle';
import moment from 'moment';

export default class DriveModal extends Component {

    constructor(props) {
        super(props);

    }



    renderVolunteer = (item) => {
        const imageUrl = item.image_url ? { uri: item.image_url } : require(`../assets/images/user.png`);

        return (<Image key={item.id} source={imageUrl} style={[styles.avtarImage]} />)
    }


    render() {
        const { driveDetail } = this.props;

        return (
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.props.showModal}
                    onRequestClose={() => { this.props.onClose() }}  >
                    <TouchableWithoutFeedback onPress={() => { this.props.onClose() }}  >
                        <View style={{ backgroundColor: "rgba(0,0,0,0.5)", height: '15%' }}></View>
                    </TouchableWithoutFeedback>
                    <View style={{ backgroundColor: "rgba(0,0,0,0.5)" }} >
                        <View style={[styles.mainView]}>
                            <FeatherIcon name={'chevron-down'} size={30} style={{ alignSelf: 'flex-start', left: 20, marginVertical: 10 }} color={'#4261d2'} onPress={() => { this.props.onClose() }} />
                            <View style={{ marginHorizontal: 20 }}>
                                <View>
                                    <Text style={[AppStyle.mediumFont, { fontSize: 20 }]}>{driveDetail.name}</Text>
                                    <Text style={[AppStyle.mediumFont, AppStyle.darkGrayColor, AppStyle.text16]}>{moment(driveDetail.date).format('dddd, DD.MM.YYYY')}</Text>
                                    <Text style={[AppStyle.mediumFont, AppStyle.darkGrayColor, AppStyle.text16]}>10:00 AM - 10:30 AM</Text>
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Text style={[AppStyle.mediumFont, AppStyle.darkGrayColor, { fontSize: 16 }]}>Active Volunteers</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        {driveDetail.invite_peoples.map((item) => {
                                            return this.renderVolunteer(item);
                                        })}
                                    </View>
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    <Text style={[AppStyle.mediumFont, AppStyle.darkGrayColor, { fontSize: 16 }]}>Food Type</Text>
                                    <View style={{ flexDirection: 'row', marginTop: 5, flexWrap: 'wrap' }}>
                                        {driveDetail.food_type.map((item) => {
                                            return (<View key={item.id} style={{ flexDirection: 'row', marginTop: 10, borderRadius: 25, backgroundColor: '#d7def6', padding: 10, justifyContent: 'space-between', alignItems: 'center', marginRight: 5, }}>
                                                <FeatherIcon name={'message-circle'} size={25} style={{ backgroundColor: '#00f', color: '#fff', borderRadius: 15, padding: 2.5 }} />
                                                <Text style={[AppStyle.regularFont, { fontSize: 16, color: '#1251cf', marginHorizontal: 10 }]}>{item.name}</Text>
                                            </View>)
                                        })}
                                    </View>
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Text style={[AppStyle.mediumFont, AppStyle.darkGrayColor, { fontSize: 16 }]}>People Served</Text>
                                    <Text style={[AppStyle.mediumFont, { marginTop: 10, fontSize: 20 }]}>{driveDetail.count_serve ? driveDetail.count_serve + "+" : 0}</Text>
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    <Text style={[AppStyle.mediumFont, AppStyle.darkGrayColor, { fontSize: 16 }]}>Short description</Text>
                                    <Text style={[AppStyle.mediumFont, { marginTop: 10, fontSize: 18 }]}>{driveDetail.description}</Text>
                                </View>

                            </View>
                        </View>

                    </View>
                </Modal>
            </View>
        )
    }
}
             
const styles = StyleSheet.create({
    mainView: {
        width: '100%',
        height: '100%',
        // top: "15%",
        backgroundColor: '#fff',
        marginTop: (Platform.OS) === 'ios' ? 20 : 0,
    },
    avtarImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});





