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


export default class ForgotPassword extends Component {

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


    submit = () => {
        // this.props.navigation.navigate('VerifyOtp');
        try {
            const { email } = this.state;
            if ((Object.keys(this.validateField()).length == 0)) {
                this.setState({loading:true});
                Authentication.forgotPassword(email).then((res)=>{
                    this.setState({loading:false});
                    let data = res.data;
                    data.email = email;

                    this.props.navigation.navigate('VerifyOtp',{
                        data:data
                    });
                }).catch((error)=>{
                    console.log("Forgot",error);
                    this.setState({formErrors:error.data,loading:false})
                });
              
            }
        } catch (error) {
            console.log(error);
        }
    }

    


    validateField() {
        const { email, } = this.state;
        let fieldValidationErrors = {};

        if (!email || email.trim() == '') {
            fieldValidationErrors.email = 'Email is required';
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
                        <Ionicons name={'ios-arrow-round-back'} size={40} onPress={() => this.props.navigation.goBack()} />
                        <View style={{ marginLeft: 20 }}>
                            <Text style={[StyleApp.headerText]}>Forgot Password</Text>
                            <Text style={[StyleApp.headerSubText]}>Retrive your password using email</Text>
                        </View>
                    </View>


                <View style={[styles.formContainer]}>
                    <View style={{ width: '90%', flexDirection: 'row', backgroundColor: 'rgba(250,250,254,1)' }}>
                        
                        {/* <Image source={require(`../../assets/images/user_gray.png`)}   style={{alignSelf:'center', marginLeft:10,bottom:2 }} /> */}

                        <TextField
                            keyboardType={'email-address'}
                            autoCapitalize="none"
                            placeholder={'Email Address'}
                            style={{ paddingLeft: 10,alignSelf:'center',minHeight:40 }}
                            value={this.state.email}
                            onChangeText={text => { this.setState({ email: text }); }}
                        />
                    </View>

                    {this.state.formErrors.email &&  <Text style={[AppStyle.errorText]}> {this.state.formErrors.email}</Text>}
                  

                    {this.state.formErrors.message && <Text style={[AppStyle.errorText]}> {this.state.formErrors.message}</Text>}

                    <TouchableOpacity style={ [{ marginTop: 20, height: 44, width: "90%", borderRadius: 22,  alignItems: 'center', justifyContent: 'center' },AppStyle.boxWithShadow,AppStyle.primaryBackgroundColor]}
                        onPress={this.submit}>
                        <Text style={[AppStyle.buttonText,StyleApp.boldFont]}>Submit</Text>
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
        marginTop: 40
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
