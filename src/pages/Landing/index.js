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
const height = Dimensions.get('window').height;
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';

export default class Landing extends Component {

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
            <View style={styles.mainContainer}>
                    <Image source={require(`../../assets/images/Landing-header.jpg`)} style={[styles.iconImage]} resizeMode={'stretch'} />

                    <Image source={require(`../../assets/images/explore_robin.png`)} style={{ height: "30%", width: '100%' }} resizeMode={'stretch'} />


                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10,height:'5%' }}>
                        <TouchableOpacity style={[styles.button]} onPress={() => this.props.navigation.navigate('Signin')} >
                            <Text style={[AppStyle.text12, AppStyle.buttonText, StyleApp.boldFont]}>Login</Text>
                        </TouchableOpacity>
                        <Text style={[AppStyle.darkGrayColor, AppStyle.regularFont]}>Join the Noble Cause?</Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Registration')} >
                            <Text style={[StyleApp.text16, StyleApp.primaryColor, StyleApp.extraBoldFont]}>Register</Text>
                        </TouchableOpacity>
                    </View>

               
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        height:height
    },
    iconImage: {

        width: "100%",
        height: "64%"

    },
    
    button: {
        borderRadius: 22,
        backgroundColor:  StyleApp.primaryColor.color,
        alignItems: 'center',
        justifyContent: 'center',
        // height: 44,
        paddingVertical: 5,
        paddingHorizontal: 10
    }


});




// <View style={[styles.formContainer]}>

// <TouchableOpacity style={[AppStyle.button]} onPress={() => this.props.navigation.navigate('Signin')}>
//     <Text style={[AppStyle.buttonText]}>Login</Text>
// </TouchableOpacity>
// </View>

// <View style={{ left: "10%", alignItems: 'center', width: "80%", marginTop: 5 }}>
// <Text style={[AppStyle.grayColor, AppStyle.regularFont]}>Do you want to Join the Noble Cause?</Text>
// <TouchableOpacity style={{ marginTop: 5 }} onPress={() => this.props.navigation.navigate('Registration')} >
//     <Text style={[AppStyle.text18, AppStyle.pramaryColor, AppStyle.mediumFont]}>Register</Text>
// </TouchableOpacity>
// </View>

