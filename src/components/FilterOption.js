import React, { Component } from 'react';
import { View, StatusBar, Alert, StyleSheet, Image, Modal, Text, TouchableOpacity, Platform, TouchableWithoutFeedback } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Slider from '@react-native-community/slider';

import PickerDropdown from './PickerDropdown';
import MaterialPicker from './MaterialPicker';
import ExtendDatePicker from './ExtendDatePicker';
import CommonService from '../services/CommonService';
import AppStyle from '../style/AppStyle';
import moment from 'moment';

export default class FilterOption extends Component {

    constructor(props) {
        super(props);
        this.state = { filter: {},formErrors:{} };
    }

    UNSAFE_componentWillMount() {
        const cityid = global.user.city.id;
        CommonService.getZone(cityid).then((res) => {
            this.setState({ zoneList: res.data });
        }).catch((error) => {
            console.log(error);
        });
    }

    clearFilter(){
        this.setState({filter:{}},()=>{
             this.props.onApplyFilter(undefined);
        })
    }

    applyFilter(){
        if ((Object.keys(this.validateField()).length == 0)) {
            this.props.onApplyFilter(this.state.filter);
        }
    }

    validateField() {
        const { filter } = this.state;
        let fieldValidationErrors = {};

        if(filter.endDate && !filter.startDate){
            fieldValidationErrors.startDate = "Start date require if end date available."
            
        }

        if(filter.startDate && filter.endDate){
            if(!moment(moment(filter.startDate).format('YYYY-MM-DD')).isSameOrBefore(moment(filter.endDate).format('YYYY-MM-DD'))){
                fieldValidationErrors.endDate = "End date must be after of start date.";
                
            }
        }

        this.setState({
            formErrors: fieldValidationErrors
        });
        return fieldValidationErrors;
    }


    render() {

        return (
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.props.showModal}
                    onRequestClose={() => { this.props.onClose() }}  >
                    <TouchableWithoutFeedback onPress={() => { this.props.onClose() }}  >
                        <View style={{ backgroundColor: "rgba(0,0,0,0.5)", height: '38%' }}></View>
                    </TouchableWithoutFeedback>
                    <View style={{ backgroundColor: "rgba(0,0,0,0.5)" }} >
                        <View style={[styles.mainView]}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20,alignItems:'center'}}>

                            <FeatherIcon name={'chevron-down'} size={30} style={{ alignSelf: 'flex-start',  marginVertical: 10 }} color={'#4261d2'} onPress={() => { this.props.onClose() }} />
                            <TouchableOpacity onPress={this.clearFilter.bind(this)}><Text style={[AppStyle.cyanColor,AppStyle.semiBoldFamily]}>Clear</Text></TouchableOpacity>
                            </View>
                           
                            <View style={{ marginHorizontal: 20 }}>


                                <Text style={[AppStyle.text14, AppStyle.mediumFont]}>Area/Zone</Text>


                                <MaterialPicker
                                    labelProps={'name'}
                                    data={this.state.zoneList}
                                    value={this.state.filter.zone}
                                    onChangeText={(item) => {
                                        console.log(item);
                                        this.setState({ filter: Object.assign(this.state.filter, { zone: item }) })
                                    }}
                                />

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginVertical: 10 }}>

                                    <View style={{flex:1}}>
                                    <ExtendDatePicker
                                        label="Start date"
                                        mode="date"
                                        minimumDate={new Date()}
                                        date={this.state.filter.startDate}
                                        onSelect={(date) => {
                                            this.setState({ filter: Object.assign(this.state.filter, { startDate: date }) })

                                        }}
                                    />
                    {this.state.formErrors.startDate && <Text style={[AppStyle.errorText]}> {this.state.formErrors.startDate}</Text>}
                                    </View>
                                    
                                        <View style={{flex:1}}>
                                    <ExtendDatePicker
                                        label="End date"
                                        mode="date"
                                        minimumDate={new Date()}
                                        date={this.state.filter.endDate}
                                        onSelect={(date) => {
                                            this.setState({ filter: Object.assign(this.state.filter, { endDate: date }) })

                                        }}
                                    />
                                                        {this.state.formErrors.endDate && <Text style={[AppStyle.errorText]}> {this.state.formErrors.endDate}</Text>}

                                                        </View>
                                </View>

                                <View style={{ marginVertical: 10 }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={[AppStyle.text14, AppStyle.mediumFont]}>Robins :</Text>
                                        <Text style={[AppStyle.text14, AppStyle.mediumFont, AppStyle.blackColor, { marginHorizontal: 10 }]}>{this.state.filter.robins && +this.state.filter.robins}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text>3</Text>
                                        <Slider
                                            style={{ width: '95%', height: 40 }}
                                            minimumValue={3}
                                            maximumValue={10}
                                            step={1}
                                            minimumTrackTintColor={AppStyle.primaryColor.color}
                                            maximumTrackTintColor="#000000"
                                            onValueChange={value => this.setState({ filter: Object.assign(this.state.filter, { robins: value }) })}
                                            value={this.state.filter.robins}
                                        />
                                        <Text>10</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <TouchableOpacity style={{ left: "10%", marginTop: 20, height: 44, paddingHorizontal: 30, borderRadius: 22, backgroundColor: '#efefef', alignItems: 'center', justifyContent: 'center' }}
                                    onPress={() => { this.props.onClose() }}
                                    >
                                        <Text style={{ color: '#000', textTransform: 'uppercase', fontFamily: 'Montserrat-SemiBold' }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[{ left: "10%", marginTop: 20, height: 44, paddingHorizontal: 30, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, AppStyle.primaryBackgroundColor]}
                                        onPress={() => this.applyFilter(this.state.filter)}
                                    >
                                        <Text style={{ color: '#fff', textTransform: 'uppercase', fontFamily: 'Montserrat-SemiBold' }}>Apply</Text>
                                    </TouchableOpacity>

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





