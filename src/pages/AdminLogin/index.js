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
import AppStyle from '../../style/AppStyle';


export default class Signin extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    render() {
        return (
            <ScrollView style={styles.mainContainer}>
                <Image source={require(`../../assets/images/app_icon.png`)} style={[styles.iconImage]} resizeMode={'stretch'} />

                <View style={[styles.formContainer]}>
                    <View style={{ width:'80%', flexDirection: 'row',  backgroundColor: 'rgba(250,250,254,1)' }}>
                        <FeatherIcon size={20} name={'user'} color={'rgb(216,215,224)'} style={{top:8,paddingLeft:5}} />
                        <TextField
                            placeholder={'Email Address'}
                            style={{  paddingLeft: 5 }}
                        />
                    </View>
                    <View style={{width:'80%', flexDirection: 'row', backgroundColor: 'rgba(250,250,254,1)',marginTop:10 }}>
                        <FeatherIcon size={20} name={'lock'} color={'rgb(216,215,224)'}  style={{top:8,paddingLeft:5}} />
                        <TextField
                            placeholder={'Password'}
                            style={{  paddingLeft: 5}}
                        />
                    </View>
                    <TouchableOpacity style={[{ marginVertical: 20, height: 44, width: "80%", borderRadius: 22,  alignItems: 'center', justifyContent: 'center' },AppStyle.boxWithShadow,AppStyle.primaryBackgroundColor]}>
                        <Text style={{ color: '#fff', textTransform: 'uppercase', fontFamily: 'Montserrat-Regular' }}>Login</Text>
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
        height: 200,
        width: "60%",
        left: "20%",
        marginTop: 40,borderRadius:10
    },
    formContainer: {
        left: "10%",
        marginTop: 20
    },
    seperation: {
        width: '80%',
        height: 20,
        left: 40,
        marginTop: 30,
        alignItems: 'center'
    },
    orLable: {

        height: 20,
        top: -10,
        display: 'flex',
        backgroundColor: '#ffffff',
        zIndex: 9999,
        paddingHorizontal: 5,
        color: '#D8D8D8', fontFamily: 'Montserrat-Regular'
    }


});
