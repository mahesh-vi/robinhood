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


export default class ResetPassword extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            formErrors: {},
            email: this.props.navigation.getParam('email', null)
        };
        console.log('Reset Password',this.props.navigation.getParam('email', null));
    }


    submit = () => {

        try {
            const { password, confirmpassword } = this.state;
            if ((Object.keys(this.validateField()).length == 0)) {
                this.setState({loading:true});
                Authentication.resetPassowrd(this.state.email, password, confirmpassword).then((res) => {
                    this.setState({ loading: false });
                    console.log("Login Response", res);

                    this.props.screenProps.alert({
                        title: 'Robinhood',
                        body: res.data.message});

                    this.props.navigation.dispatch({
                        type: 'Navigation/RESET',
                        index: 0,
                        actions: [{ type: 'Navigate', routeName: 'Signin' }]
                    });
                }).catch((error) => {

                    this.setState({
                        formErrors: error.data,
                        loading: false
                    });
                });
            }
        } catch (error) {
            console.log(error);
        }
    }




    validateField() {
        const { password, confirmpassword } = this.state;
        let fieldValidationErrors = {};

        if (!password || password.trim() == '') {
            fieldValidationErrors.password = 'Password is required';
        }

        if (!confirmpassword || confirmpassword.trim() == '') {
            fieldValidationErrors.confirmpassword = 'Confirm Password is required';
        }

        if ((password && password.trim() !== '') && (confirmpassword && confirmpassword.trim() != '')) {
            if (password !== confirmpassword) {
                fieldValidationErrors.message = 'Password and Confirm Password must be same.';
            }
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
                            <Text style={[StyleApp.headerText]}>Reset Password</Text>
                            <Text style={[StyleApp.headerSubText]}>Set your new password</Text>
                        </View>
                    </View>


                    <View style={[styles.formContainer]}>
                        <View style={{ width: '90%', flexDirection: 'row', backgroundColor: 'rgba(250,250,254,1)' }}>

                            {/* <Image source={require(`../../assets/images/user_gray.png`)}   style={{alignSelf:'center', marginLeft:10,bottom:2 }} /> */}

                            <TextField
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder={'Password'}
                                style={{ paddingLeft: 10, minHeight: 50 }}
                                value={this.state.password}
                                secureTextEntry={true}
                                onChangeText={text => this.setState({ password: text })}
                            />
                        </View>

                        {this.state.formErrors.password && <Text style={[AppStyle.errorText]}> {this.state.formErrors.password}</Text>}

                        <View style={{ width: '90%', flexDirection: 'row', backgroundColor: 'rgba(250,250,254,1)', marginTop: 20 }}>

                            {/* <Image source={require(`../../assets/images/user_gray.png`)}   style={{alignSelf:'center', marginLeft:10,bottom:2 }} /> */}

                            <TextField
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder={'Confirm Password'}
                                style={{ paddingLeft: 10, minHeight: 50 }}
                                value={this.state.confirmpassword}
                                secureTextEntry={true}
                                onChangeText={text => this.setState({ confirmpassword: text })}
                            />
                        </View>
                        {this.state.formErrors.confirmpassword && <Text style={[AppStyle.errorText]}> {this.state.formErrors.confirmpassword}</Text>}


                        {this.state.formErrors.message && <Text style={[AppStyle.errorText]}> {this.state.formErrors.message}</Text>}

                        <TouchableOpacity style={[{ marginTop: 20, height: 44, width: "90%", borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, AppStyle.boxWithShadow, AppStyle.primaryBackgroundColor]}
                            onPress={this.submit}>
                            <Text style={[AppStyle.buttonText, StyleApp.boldFont]}>Submit</Text>
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
        alignSelf: 'center',
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
