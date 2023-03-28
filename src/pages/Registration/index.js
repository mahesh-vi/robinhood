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
    TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
const window = Dimensions.get('window');
import TextField from '../../components/TextField';
import CommonService from '../../services/CommonService';
import PickerDropdown from '../../components/PickerDropdown';
import ExtendDatePicker from '../../components/ExtendDatePicker';
import Loader from '../../components/Loader';
import Authentication from '../../services/Authentication';
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle'
import CommonUtil from '../../utils/CommonUtil';

export default class Registration extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isDonor: null,
            countriesList: [],
            userDetail: {},
            formErrors: {}
        };
    }

    UNSAFE_componentWillMount = () => {
        CommonService.getCountries().then((res) => {
            console.log(res);
            this.setState({ countriesList: res.data });

        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     * @method onChangeCountries
     * @description country picker onChange listener when change value 
     */
    onChangeCountries = (countryid) => {
        CommonService.getState(countryid).then((res) => {
            const stateList = res.data;
            this.setState({ stateList: stateList });
            this.onChangeState(stateList[0].id);
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     * @method onChangeState
     * @description state picker onChange listener when change value 
     */
    onChangeState = (stateid) => {
        CommonService.getCity(stateid).then((res) => {
            this.setState({ cityList: res.data });
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
   * @method onChangeState
   * @description state picker onChange listener when change value 
   */
    onChangeCity = (cityid) => {
        CommonService.getZone(cityid).then((res) => {
            this.setState({ zoneList: res.data });
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     * @function register
     * @description register user in application
     */

    register = () => {
        console.log(this.state.userDetail);
        const { userDetail, isDonor } = this.state;
        if ((Object.keys(this.validateField()).length == 0) && this.state.agreedTerm) {
            this.setState({ loading: true });
            Authentication.register(userDetail, isDonor).then((res) => {
                console.log(res);
                const { data } = res;
                this.storeData(data);

                this.setState({ loading: false });
            }).catch((error) => {
                console.log(error);
                const { message, errors } = error;
                let errorList = [];

                Object.keys(errors).forEach(item => {
                    errorList.push(errors[item][0])
                });

                let fieldValidationErrors = {
                    generalError: errorList
                };
                this.setState({ formErrors: errors, loading: false });
            });
        }else{
            if (Object.keys(this.validateField()).length == 0){
                this.setState({ agreedTerm: false });
            }
        }
    }

    /**
     * @function storeData
     * @description store user token and userinfo for further use in app
     * @param data Oject
     */
    storeData = async (data) => {
        try {
            const user = data;
            global.user = user;
            let token = await AsyncStorage.multiSet([['token', data.api_token || JSON.stringify(true)], ['user', JSON.stringify(user)]]);
            this.setState({ loading: false });
            this.props.navigation.navigate('App');

        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }

    /**
     * @method validateField
     * @description check validation of all user information
     */
    validateField() {
        const { firstname, lastname, phone, country_id, state_id, city_id, email, password, password_confirmation, bod } = this.state.userDetail;

        let fieldValidationErrors = {};


        if (!firstname || firstname.trim() == '') {
            fieldValidationErrors.firstname = "First Name is required."
        }

        if (!lastname || lastname.trim() == '') {
            fieldValidationErrors.lastname = "Last Name is required."
        }


        if (!phone) {
            fieldValidationErrors.phone = "WhatsApp Number is required."
        }

        if (!bod) {
            fieldValidationErrors.bod = "Date of birth is required.";
        }

        if (!country_id) {
            fieldValidationErrors.country_id = "Country is required."
        }


        if (!state_id) {
            fieldValidationErrors.state_id = "State is required."
        }

        if (!city_id) {
            fieldValidationErrors.city_id = "City is required."
        }

        if (!email) {
            fieldValidationErrors.email = "Email is required."
        } else if (!CommonUtil.validateEmail(email)) {
            fieldValidationErrors.email = "Email is not valid."
        }

        if (!password || password.trim() == '') {
            fieldValidationErrors.password = "Password is required."
        }else if (password.length < 8) {
            fieldValidationErrors.password = 'Minimum Password size to be 8 characters.';
        }

        if (!password_confirmation || password_confirmation.trim() == '') {
            fieldValidationErrors.password_confirmation = "Password Confirmation is required."
        }

        if ((password && password.trim() !== '') && (password_confirmation && password_confirmation.trim() != '')) {
            if (password !== password_confirmation) {
                fieldValidationErrors.generalError = 'Password and Confirm Password must be same.';
            }
        }

        if (this.state.isDonor == null) {
            fieldValidationErrors.userType = "Please select user type."

        }

        this.setState({
            formErrors: fieldValidationErrors
        });
        console.log(fieldValidationErrors);
        return fieldValidationErrors;

    }


    render() {
        const volunteerImage = (!this.state.isDonor && this.state.isDonor !== null) ? require(`../../assets/images/volunteer.png`) : require(`../../assets/images/volunteer-gray.png`);
        const donerImage = (this.state.isDonor && this.state.isDonor !== null) ? require(`../../assets/images/doner.png`) : require(`../../assets/images/doner-gray.png`);

        return (
            <ScrollView style={styles.mainContainer}>
                <Loader loading={this.state.loading} />
                <View style={{ marginHorizontal: 20, marginVertical: 15, flexDirection: 'row', alignItems: 'center', }}>
                    <Image source={require(`../../assets/images/app_icon.png`)} style={[styles.iconImage]} resizeMode={'stretch'} />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={[StyleApp.headerText]}>Registration</Text>
                        <Text style={[StyleApp.headerSubText]}>Fill the below form to join the army</Text>

                    </View>
                </View>

                <View style={{ marginLeft: "10%", width: "80%" }}>

                    <TextField
                        placeholder={'First Name'}
                        style={styles.inputContainer}
                        onChangeText={text => this.setState({ userDetail: Object.assign(this.state.userDetail, { firstname: text }) })}
                    />
                    {this.state.formErrors.firstname && <Text style={[AppStyle.errorText]}> {this.state.formErrors.firstname}</Text>}


                    <TextField
                        placeholder={'Last Name'}
                        style={styles.inputContainer}
                        onChangeText={text => this.setState({ userDetail: Object.assign(this.state.userDetail, { lastname: text }) })}
                    />
                    {this.state.formErrors.lastname && <Text style={[AppStyle.errorText]}> {this.state.formErrors.lastname}</Text>}


                    <TextField
                        placeholder={'Whatsapp Number'}
                        style={styles.inputContainer}
                        keyboardType={'numeric'}
                        returnKeyType='done'
                        value={this.state.userDetail.phone}
                        maxLength={10}
                        onChangeText={value =>
                            {

                                if (/^\d+$/.test(value.toString())) { 
                                    this.setState({ userDetail: Object.assign(this.state.userDetail, { phone: value }) });
                                  }else if(value==''){
                                    this.setState({ userDetail: Object.assign(this.state.userDetail, { phone: value }) });
                                  }
                             // this.setState({ userDetail: Object.assign(this.state.userDetail, { phone: text }) });
                        }}

                    />
                    {this.state.formErrors.phone && !this.state.userDetail.phone && <Text style={[AppStyle.errorText]}> {this.state.formErrors.phone}</Text>}

                    <View >
                        <ExtendDatePicker
                            label="Date of birth"
                            mode="date"
                            maximumDate={new Date()}
                            date={this.state.userDetail.bod}
                            style={[{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingHorizontal: 5 }, styles.inputContainer]}
                            removeIcon={true}
                            onSelect={(date) => {
                                this.setState({ userDetail: Object.assign(this.state.userDetail, { bod: date }) })
                            }}
                        />
                        {this.state.formErrors.bod && <Text style={[AppStyle.errorText]}>{this.state.formErrors.bod}</Text>}
                    </View>


                    <PickerDropdown
                        placeholder={'Country'}
                        data={this.state.countriesList}
                        value={this.state.userDetail.country_id}
                        onChange={(item) => {
                            this.onChangeCountries(item);
                            this.setState({ userDetail: Object.assign(this.state.userDetail, { country_id: item }) });
                        }}
                    />


                    <PickerDropdown
                        placeholder={'State'}
                        data={this.state.stateList}
                        value={this.state.userDetail.state_id}
                        onChange={(item) => {
                            this.onChangeState(item);
                            this.setState({ userDetail: Object.assign(this.state.userDetail, { state_id: item }) });
                        }} />

                    <PickerDropdown
                        placeholder={'City'}
                        data={this.state.cityList}
                        value={this.state.userDetail.city_id}
                        onChange={(item) => {
                            console.log(item);
                            this.onChangeCity(item);
                            this.setState({ userDetail: Object.assign(this.state.userDetail, { city_id: item }) })
                        }}
                    />

                    <PickerDropdown
                        placeholder={'Zone'}
                        data={this.state.zoneList}
                        value={this.state.userDetail.zone_id}
                        onChange={(item) => {
                            console.log(item);
                            this.setState({ userDetail: Object.assign(this.state.userDetail, { zone_id: item }) })
                        }}
                    />


                    <TextField
                        placeholder={'Email'}
                        keyboardType={'email-address'}
                        autoCapitalize="none"
                        style={styles.inputContainer}
                        onChangeText={text => this.setState({ userDetail: Object.assign(this.state.userDetail, { email: text }) })}
                    />
                    {this.state.formErrors.email && <Text style={[AppStyle.errorText]}> {this.state.formErrors.email}</Text>}

                    <TextField
                        placeholder={'Enter Password'}
                        autoCapitalize="none"
                        style={styles.inputContainer}
                        secureTextEntry={true}
                        maxLength={20}
                        onChangeText={text => this.setState({ userDetail: Object.assign(this.state.userDetail, { password: text }) })}
                    />
                    {this.state.formErrors.password &&  <Text style={[AppStyle.errorText]}> {this.state.formErrors.password}</Text>}


                    <TextField
                        placeholder={'Re-Enter Password'}
                        autoCapitalize="none"
                        style={[styles.inputContainer]}
                        secureTextEntry={true}
                        value={this.state.userDetail.password_confirmation}
                        onChangeText={text => this.setState({ userDetail: Object.assign(this.state.userDetail, { password_confirmation: text }) })}
                    />
                    {this.state.formErrors.password_confirmation  && <Text style={[AppStyle.errorText]}> {this.state.formErrors.password_confirmation}</Text>}
                    <Text style={[AppStyle.errorText]}>{this.state.formErrors.generalError}</Text>
                </View>



                <View style={{ marginLeft: "10%", marginTop: 20, width: "80%", alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 14, color: '#5F5D70' }}>Join as</Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <TouchableOpacity style={{ alignItems: 'center', marginHorizontal: 10 }} onPress={() => { this.setState({ isDonor: false }) }}>
                            <Image source={volunteerImage} style={[styles.iconImage]} resizeMode={'stretch'} />
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: (!this.state.isDonor && this.state.isDonor !== null ? "#00CE9A" : '#D8D8D8') }}>Volunteer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => { this.setState({ isDonor: true }) }}>
                            <Image source={donerImage} style={[styles.iconImage]} resizeMode={'stretch'} />
                            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: (this.state.isDonor ? "#00CE9A" : '#D8D8D8') }}>Doner</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[AppStyle.errorText]}>{this.state.formErrors.userType}</Text>

                </View>

                <View style={{ marginLeft: "10%", marginTop: 10, width: "80%", alignItems: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity style={{ height: 20, width: 20, backgroundColor: '#D8D8D8', borderRadius: 3 }} onPress={() => this.setState({ agreedTerm: !this.state.agreedTerm })}>
                        <Icon
                            size={20}
                            color={'black'}
                            name={this.state.agreedTerm ? 'check' : null}
                        />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 10, fontFamily: 'Montserrat-Regular', fontSize: 9, color: '#5F5D70' }}>By clicking this you agree to our term & conditions</Text>

                </View>
                {Object.keys(this.state.formErrors).length == 0 && this.state.agreedTerm == false && <Text style={[AppStyle.errorText, { marginLeft: '10%' }]}>You must agree term and conditions</Text>}


                <TouchableOpacity style={[{ left: "10%", marginTop: 20, height: 44, width: "80%", borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, AppStyle.primaryBackgroundColor, StyleApp.boxShadow]}
                    onPress={this.register}>
                    <Text style={[AppStyle.buttonText, AppStyle.boldFamily, AppStyle.text12]}>LETS GO</Text>
                </TouchableOpacity>

                <View style={{ left: "10%", alignItems: 'center', width: "80%", marginVertical: 20 }}>
                    <Text style={{ color: '#9B99A9', fontFamily: 'Montserrat-Regular' }}>Already Have an account?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Signin')} >
                        <Text style={[{ color: 'rgb(114,201,158)', fontSize: 16, fontFamily: 'Montserrat-Medium' }, StyleApp.primaryColor]}>Login</Text>
                    </TouchableOpacity>
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

        width: 60,
        height: 60,
        borderRadius:10
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

        backgroundColor: 'rgba(250,250,254,1)', marginBottom: 10, marginTop: 10, width: '100%', fontFamily: 'Montserrat-Regular', fontSize: 14, color: '#5F5D70'
    }


});
