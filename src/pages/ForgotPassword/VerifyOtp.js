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
import Ionicons from 'react-native-vector-icons/Ionicons';

import TextField from '../../components/TextField';
import Loader from '../../components/Loader';
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle'

import Authentication from '../../services/Authentication';


export default class VerifyOtp extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            formErrors: {},
            data : this.props.navigation.getParam('data', null)
        };

        console.log(this.props.navigation.getParam('data', null));
    }


    submit = () => {
        
        try {
            const {  otp } = this.state;
            if ((Object.keys(this.validateField()).length == 0)) {
                this.setState({ loading: true });
                
                Authentication.otpVerification(this.state.data.email, otp).then((res) => {
                    this.setState({ loading: false });
                    console.log("Login Response", res);
                    this.props.navigation.navigate('ResetPassword',{
                        email:this.state.data.email
                    });
                }).catch((error) => {
                   
                    this.setState({
                        formErrors:error.data,
                        loading: false
                    });
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

 
   


    validateField() {
        const { otp } = this.state;
        let fieldValidationErrors = {};

        if (!otp || otp.trim() == '') {
            fieldValidationErrors.otp = 'OTP is required';
        }

    

        this.setState({
            formErrors: fieldValidationErrors
        });
        return fieldValidationErrors;
    }

    render() {
        return (
            <ScrollView style={styles.mainContainer}>
                <Loader loading={this.state.loading} />
                <View style={{ marginHorizontal: 20, marginVertical: 15, }}>
                <View style={{ flexDirection: 'row' }}>
                        <Ionicons name={'ios-arrow-back'} size={30} onPress={() => this.props.navigation.goBack()} />
                        <View style={{ marginLeft: 20 }}>
                            <Text style={[StyleApp.headerText]}>Verify OTP</Text>
                            <Text style={[StyleApp.headerSubText]}>OTP verify here</Text>
                        </View>
                    </View>

                   
                <View style={[styles.formContainer]}>

               
                <Text style={[AppStyle.regularFont, AppStyle.text16,{margin:20}]}>{this.state.data.message}</Text>

                    <View style={{ width: '90%', flexDirection: 'row', backgroundColor: 'rgba(250,250,254,1)' }}>
                        
                        {/* <Image source={require(`../../assets/images/user_gray.png`)}   style={{alignSelf:'center', marginLeft:10,bottom:2 }} /> */}

                        <TextField
                              keyboardType={'number-pad'}
                            autoCapitalize="none"
                            placeholder={'1234'}
                            style={{ paddingLeft: 10,alignSelf:'center',minHeight:40,letterSpacing:25,fontSize:20 }}
                            value={this.state.otp}
                            onChangeText={text => { this.setState({ otp: text }); }}
                        />
                    </View>

                    {this.state.formErrors.otp &&  <Text style={[AppStyle.errorText]}> {this.state.formErrors.otp}</Text>}
                  

                    {this.state.formErrors.message && <Text style={[AppStyle.errorText]}> {this.state.formErrors.message}</Text>}

                    <TouchableOpacity style={ [{ marginTop: 20, height: 44, width: "90%", borderRadius: 22,  alignItems: 'center', justifyContent: 'center' },AppStyle.boxWithShadow,AppStyle.primaryBackgroundColor]}
                        onPress={this.submit}>
                        <Text style={[AppStyle.buttonText,StyleApp.boldFont]}>Verify</Text>
                    </TouchableOpacity>

  

                </View>

              
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
        height: 150,
        width: 150,
        alignSelf:'center',
        marginTop: 40
    },
    formContainer: {
        left: 20,
        marginTop: 20
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
