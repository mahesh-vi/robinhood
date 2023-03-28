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
import FeatherIcon from 'react-native-vector-icons/Feather';

const window = Dimensions.get('window');
import TextField from '../../components/TextField';
import Loader from '../../components/Loader';
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle'

import Authentication from '../../services/Authentication';


export default class Signin extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            formErrors: {},
            favSport0: undefined,
      favSport1: undefined,
        };
    }


    signIn = () => {
        // this.props.navigation.navigate('App');
        try {
            const { email, password } = this.state;
            if ((Object.keys(this.validateField()).length == 0)) {
                this.setState({ loading: true });
                console.log(email, password);
                Authentication.login(email, password).then((res) => {
                    this.setState({ loading: false });
                    console.log("Login Response", res);
                    const { data } = res;
                    console.log(data);
                    this.storeData(data);
                    Authentication.setAuthToken(data.id);
                }).catch((error) => {
                    this.setState({ loading: false });
                    console.log("Login Error", error);
                    const {  errors } = error;
                    this.setState({
                        formErrors: Object.assign(error, errors),
                        loading: false
                    });
                });
            }
        } catch (error) {
            console.log(error);
        }
    }


    storeData = async (data) => {
        try {
            const user = data;
            global.user = user;
            let token = await AsyncStorage.multiSet([['token', data.api_token], ['user', JSON.stringify(user)]]);
            this.setState({ loading: false });
            this.props.navigation.navigate('App');

        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }


    validateField() {
        const { email, password } = this.state;
        let fieldValidationErrors = {};

        if (!email || email.trim() == '') {
            fieldValidationErrors.email = 'Email is required';
        }

        if (!password || password.trim() == '') {
            fieldValidationErrors.password = 'Password is required';
        }

        this.setState({
            formErrors: fieldValidationErrors
        });
        return fieldValidationErrors;
    }

    render() {
        return (
            <ScrollView style={styles.mainContainer} >
                <Loader loading={this.state.loading} />

                <Image source={require(`../../assets/images/app_icon.png`)} style={[styles.iconImage]} resizeMode={'stretch'} />

                <View style={[styles.formContainer]}>
                    <View style={{ width: '80%', flexDirection: 'row', backgroundColor: 'rgba(250,250,254,1)' }}>
                        {/* <FeatherIcon size={20} name={'user'} color={'rgb(216,215,224)'} style={{ top: 8, paddingLeft: 5 }} /> */}
                        
                        <Image source={require(`../../assets/images/user_gray.png`)}   style={{alignSelf:'center', marginLeft:10,bottom:2 }} />

                        <TextField
                            keyboardType={'email-address'}
                            autoCapitalize="none"
                            placeholder={'Email Address'}
                            style={{ paddingLeft: 5,alignSelf:'center' }}
                            value={this.state.email}
                            onChangeText={text => { this.setState({ email: text }); }}
                        />
                    </View>

                    {this.state.formErrors.email &&  <Text style={[AppStyle.errorText]}> {this.state.formErrors.email}</Text>}
                    <View style={{ width: '80%', flexDirection: 'row', backgroundColor: 'rgba(250,250,254,1)', marginTop: 10 }}>
                        {/* <FeatherIcon size={20} name={'lock'} color={'rgb(216,215,224)'} style={{ top: 8, paddingLeft: 5 }} /> */}
                        <Image source={require(`../../assets/images/lock-icon.png`)}   style={{alignSelf:'center', marginLeft:10,bottom:2 }} />

                        <TextField
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder={'Password'}
                            style={{ paddingLeft: 5 }}
                            value={this.state.password}
                            secureTextEntry={true}
                            onChangeText={text => this.setState({ password: text })}
                        />
                    </View>
                    {this.state.formErrors.password && <Text style={[AppStyle.errorText]}> {this.state.formErrors.password}</Text>}

                    {this.state.formErrors.message && <Text style={[AppStyle.errorText]}> {this.state.formErrors.message}</Text>}

                    <TouchableOpacity style={ [{ marginTop: 20, height: 44, width: "80%", borderRadius: 22,  alignItems: 'center', justifyContent: 'center' },AppStyle.boxWithShadow,AppStyle.primaryBackgroundColor]}
                        onPress={this.signIn}>
                        <Text style={[AppStyle.buttonText,StyleApp.boldFont]}>Login</Text>
                    </TouchableOpacity>

  

                </View>

                <View style={{ left: "10%", alignItems: 'center', width: "80%", marginTop: 10 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')} >
                        <Text style={[StyleApp.primaryColor,StyleApp.mediumFont,StyleApp.font16]}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ left: "10%", alignItems: 'center', width: "80%", marginTop: 10 }}>
                    <Text style={{ color: '#9B99A9', fontFamily: 'Montserrat-Regular' }}>Do you want to Join the Noble Cause?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Registration')} style={[AppStyle.marginTop10]}>
                        <Text style={[StyleApp.primaryColor,StyleApp.mediumFont,StyleApp.font16]}>Register</Text>
                    </TouchableOpacity>
                </View>
{/* 
                <View style={[styles.seperation]} >
                    <View style={[{ width: '100%', borderWidth: 0.5, borderColor: '#DADADA' }]}></View>
                    <Text style={[styles.orLable]}>Or join using social signin</Text>

                </View> */}
                {/* <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('AdminLogin')} >
                        <Image source={require(`../../assets/images/facebook_2.png`)} style={[{ height: 40, width: 40, marginHorizontal: 10 }]} resizeMode={'stretch'} />
                    </TouchableOpacity>
                        <Image source={require(`../../assets/images/twitter_2.png`)} style={[{ height: 40, width: 40 }]} resizeMode={'stretch'} />

                  
                </View> */}


             

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
        height: 150,
        width: 150,
        alignSelf:'center',
        marginTop: 40,
        borderRadius:5
    },
    formContainer: {
        left: "10%",
        marginTop: 30
    },
    seperation: {
        width: '80%',
        height: 20,
        left: 40,
        marginTop: 20,
        alignItems: 'center'
    },
    orLable: {

        height: 20,
        top: -10,
        display: 'flex',
        backgroundColor: '#ffffff',
        zIndex: 9999,
        paddingHorizontal: 5,
        color: '#9B99A9',
         fontFamily: 'Montserrat-Regular'
    }


});
