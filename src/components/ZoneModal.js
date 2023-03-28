import React, { Component } from 'react';
import { View, StatusBar, Alert, StyleSheet, Image, Modal, Text, TextInput, TouchableOpacity, Platform, FlatList, ScrollView } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStyle from '../style/AppStyle';
import DriveService from '../services/DriveService';


export default class ZoneModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            enableScrollViewScroll: true
        }
    }

    UNSAFE_componentWillMount = () => {
        console.log("Mount Get Drive list", this.props)
    }


    UNSAFE_componentWillUpdate= (props) => {
        let _this = this;
        console.log("Zone model receive props", props);
        const { duration, zoneDetail,showModal } = this.props;
        if (!showModal) {
            DriveService.getDriveListOnZone(zoneDetail.zoneId, duration).then((res) => {
                this.setState({areas:res.data});
                console.log("Get Drive list", res)
            });
        }


    }

    renderVolunteer = (item) => {


        const imageUrl = item.image_url ? { uri: item.image_url } : require(`../assets/images/user.png`);

        return (<Image key={item.id} source={imageUrl} style={[styles.avtarImage,{ left: -10, zIndex: -10 }]} />
        )
    }

    renderItem = (item) => {
       const areaDetail = item.item;
        return (
            <TouchableOpacity style={{ marginVertical: 10, width: '100%' }} onPress={() => this.props.onItemPress(areaDetail)}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' }}>
                    <View>
                        <Image source={{uri:`${areaDetail.image_url}`}} style={[{ width: 75, height: 75, borderRadius: 5 }]} />
                        <Text style={[AppStyle.mediumFont, AppStyle.whiteColor, { fontSize: 10, backgroundColor: '#416dcc', paddingHorizontal: 5, paddingVertical: 2, position: 'absolute', bottom: 0, borderRadius: 2 }]}>{areaDetail.people_serve}</Text>
                    </View>

                    <View style={{ marginLeft: 5 }}>
                        <Text style={[AppStyle.mediumFont, { fontSize: 14, marginVertical: 2 }]}>{areaDetail.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name={'near-me'} size={10} />
                            <Text style={[AppStyle.mediumFont, { fontSize: 10, marginVertical: 2, marginLeft: 5 }]}>{areaDetail.zone_name}</Text>
                        </View>

                        <View style={{ flexDirection: 'row',marginLeft:10 }}>
                         {areaDetail.invite_peoples.map((item) => {
                            return this.renderVolunteer(item);
                        })}
                        </View>
                    </View>
                    <Ionicons name={'ios-arrow-round-forward'} size={30} style={{ color: '#4cab83', justifyContent: 'flex-end', right: -20 }} />

                </View>
            </TouchableOpacity>
        )
    }


    render() {
        const { zoneDetail } = this.props;

        return (
            <View style={{ alignItems: 'center', flex: 1 }} onStartShouldSetResponderCapture={() => {
                this.setState({ enableScrollViewScroll: true });
            }}>

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.props.showModal}
                    onRequestClose={() => { this.props.onClose() }}  >
                    <ScrollView style={[styles.mainView, { backgroundColor: "#79d0aa" }]}

                        scrollEnabled={this.state.enableScrollViewScroll}
                        ref={myScroll => (this._myScroll = myScroll)}>
                        <View style={[{ marginTop: 50, alignItems: 'center' }]} >

                            <Text style={[AppStyle.regularFont, AppStyle.whiteColor, AppStyle.text18, {}]}>{zoneDetail.snapshopDetail.zonedetails.name}</Text>

                        </View>

                        <View style={[{ marginTop: '10%', marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 5 }]}>
                            <View style={{ marginHorizontal: 20, marginTop: 20, borderRadius: 5 }}>
                                <TextInput
                                    placeholder={'Search Areas'}
                                    style={[AppStyle.inputContainer, { backgroundColor: '#f5f5f5', borderRadius: 5 }]}
                                />
                            </View>
                            <View style={{ marginHorizontal: 20 }} onStartShouldSetResponderCapture={() => {
                                this.setState({ enableScrollViewScroll: false });
                                if (this._myScroll.contentOffset === 0
                                    && this.state.enableScrollViewScroll === false) {
                                    this.setState({ enableScrollViewScroll: true });
                                }
                            }}>

                                <FlatList
                                    data={this.state.areas}
                                    renderItem={this.renderItem.bind(this)}
                                    keyExtractor={item => ""+item.drive_id}
                                    maxHeight={400}
                                    minHeight={300}
                                />
                            </View>
                        </View>

                        <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: 20, marginBottom: 20, borderRadius: 30, backgroundColor: '#fff', }}>
                            <FeatherIcon name={'x'} size={20} style={{ padding: 20, color: '#000' }} onPress={() => { this.props.onClose() }} />
                        </View>

                    </ScrollView>
                </Modal>
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
});





