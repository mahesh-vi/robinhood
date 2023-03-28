import React, { Component } from 'react';
import { View, StatusBar, TextInput, StyleSheet, Image, Modal, Text, TouchableOpacity, Platform, TouchableWithoutFeedback,ScrollView } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';


export default class RemoveRobin extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }


  



    render() {
        const {robin} = this.props;
        return (
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.props.showModal}
                    onRequestClose={() => { this.props.onClose() }}  >
                    <TouchableWithoutFeedback onPress={() => { this.props.onClose() }}  >
                        <View style={{ backgroundColor: "transparent", height: '35%' }}></View>
                    </TouchableWithoutFeedback>
                    <ScrollView style={{ backgroundColor: "#fff" }} >
                        <View style={[styles.mainView, AppStyle.boxWithShadow]}>
                            <FeatherIcon name={'chevron-down'} size={30} style={{ alignSelf: 'flex-start', left: 20, marginVertical: 10 }} color={StyleApp.primaryColor.color} onPress={() => { this.props.onClose() }} />
                            <View style={{ marginHorizontal: 20 }}>
                                <Text style={[AppStyle.mediumFont, AppStyle.blackColor, StyleApp.font24]}>{'Are you sure you want to remove this robin?'}</Text>

                                <View style={{ marginVertical: 20 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image source={{ uri: `${robin.image_url}` }}  style={[{ width: 50, height: 50, borderRadius: 25 }]} />
                                        </View>
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={[AppStyle.blackColor, AppStyle.semiBoldFamily]}>{robin.name}</Text>
                                            <View style={{ backgroundColor: '#000000', alignSelf: 'flex-start', marginTop: 2 }}>
                                                <Text style={[AppStyle.boldFamily, AppStyle.text10, AppStyle.whiteColor, { textAlign: 'center', backgroundColor: AppStyle.cyanColor.color, paddingHorizontal: 5 }]}>{robin.complete_drive} Successful Drive</Text>
                                            </View>
                                        </View>
                                                         
                                    </View>
                                </View>
                                <View style={{ marginVertical: 10, }}>
                                    <Text style={[AppStyle.text14,StyleApp.mediumFont]}>Any Reason if Any? (Optional)</Text>
                                    <TextInput
                                        style={[AppStyle.regularFont, { justifyContent: 'flex-start', textAlignVertical: 'top', borderBottomWidth: 1.5, borderBottomColor: '#dedede' }]}
                                        underlineColorAndroid="transparent"
                                        placeholderTextColor="grey"
                                        onChangeText={(text)=>this.setState({message:text})}
                                    />
                                </View>

                                <View style={{ marginTop: 10, width: "90%", alignItems: 'center', flexDirection: 'row' }}>
                                    <TouchableOpacity style={{ height: 20, width: 20, borderWidth:0.5 }} onPress={() => this.setState({ agreedTerm: !this.state.agreedTerm })}>
                                        <MaterialIcons
                                            size={18}
                                            color={this.state.agreedTerm? '#7ED321':'#fff'}
                                            name={ 'check' }
                                        />
                                    </TouchableOpacity>
                                    <Text style={[StyleApp.mediumFont,StyleApp.grayColor, { marginLeft: 10,  fontSize: 14}]}>I want new robin to join this drive</Text>
                                </View>

                
                                    <TouchableOpacity style={[{ marginTop: 10, height: 44, paddingHorizontal: 30, borderRadius: 22,  alignItems: 'center', justifyContent: 'center' },AppStyle.primaryBackgroundColor]}
                                        onPress={()=>this.props.onRemove(this.state.message)} >
                                        <Text style={{ color: '#fff', textTransform: 'uppercase', fontFamily: 'Montserrat-Bold' }}>Remove Robin</Text>
                                    </TouchableOpacity>

                                </View>


                            </View>
                        </ScrollView>

                   
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
        paddingHorizontal: 20
    },
    avtarImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});
