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
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';


import AppStyle from '../../style/AppStyle';
import PickerDropdown from '../../components/PickerDropdown';
import Loader from '../../components/Loader';

import Authentication from '../../services/Authentication';
import CommonUtil from '../../utils/CommonUtil';
import StyleApp from '../../style/NewAppStyle';

const window = Dimensions.get('window');

export default class Profile extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userType: null
        };
    }

    logout = () => {
        this.setState({ loading: true });
        Authentication.logout().then((res) => {
            console.log(res);
            this.setState({ loading: false });
            CommonUtil.logout(this.props.navigation);
        }).catch((error) => {
            this.setState({ loading: false });
            console.log(error);
        });
    }

    render() {
        return (
            <ScrollView style={styles.mainContainer}>
                <Loader loading={this.state.loading} />
                <View style={{ marginHorizontal: 20, marginVertical: 15, }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons name={'ios-arrow-round-back'} size={40} onPress={() => this.props.navigation.goBack()} />

                        <View style={{ marginLeft: 30 }}>
                            <Text style={[StyleApp.headerText]}>Robin Profile</Text>
                            <Text style={[StyleApp.headerSubText]}>Check your Robin profile here</Text>

                        </View>
                    </View>


                    <View>
                        <View style={{ borderBottomColor: '#afb4c0', borderBottomWidth: 1, marginVertical: 10, paddingBottom: 20 }}>
                            <View style={{ alignItems: 'center' }}>

                                <TouchableOpacity style={{ borderWidth: 1, borderRadius: 75, width: 150, height: 150 }} >

                                    <Image source={require(`../../assets/images/user_male.png`)} style={[{ width: 150, height: 150 }]} />
                                    <View style={[{ position: 'absolute', bottom: 20, right: 0, borderWidth: 1, padding: 10, borderRadius: 20, backgroundColor: "#fff" }, AppStyle.primaryBorder]}>
                                        <FontAwesomeIcon size={20} name={'camera'} style={[AppStyle.pramaryColor]} />
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View >
                                <Text style={[{ textAlign: 'center' }, AppStyle.boldFamily, AppStyle.text20, AppStyle.darkGrayColor]}>
                                    John Deo
                                </Text>
                                <Text style={[{ textAlign: 'center' }, AppStyle.regularFont, AppStyle.text12, AppStyle.darkGrayColor]}>Volunteer</Text>
                            </View>
                        </View>

                        <View style={{ marginHorizontal: 20 }}>
                            <View style={{ flex: 1, flexDirection: 'row', marginVertical: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[AppStyle.text12,]}>Email</Text>
                                    <Text style={[AppStyle.text14]}>john@gmail.com</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[AppStyle.text12,]}>Mobile</Text>
                                    <Text style={[AppStyle.text14]}>9541236870</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', marginVertical: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[AppStyle.text12,]}>Country</Text>
                                    <Text style={[AppStyle.text14]}>India</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[AppStyle.text12,]}>State</Text>
                                    <Text style={[AppStyle.text14]}>Gujarat</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[AppStyle.text12,]}>City</Text>
                                    <Text style={[AppStyle.text14]}>Ahmedabad</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[AppStyle.text12,]}>Area</Text>
                                    <Text style={[AppStyle.text14]}>Ranip</Text>
                                </View>
                            </View>
                        </View>
                    </View>


                    <TouchableOpacity style={[{ left: "10%", marginTop: 20, height: 44, width: "80%", borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, AppStyle.primaryBackgroundColor]}
                        onPress={() => { this.props.navigation.navigate('EditProfile') }}
                    >
                        <Text style={{ color: '#fff', textTransform: 'uppercase', fontFamily: 'Montserrat-Regular' }}>Edit</Text>
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
        height: 80,
        width: 80,

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

        backgroundColor: 'rgba(250,250,254,1)', marginBottom: 10, width: '100%', fontFamily: 'Montserrat-Regular', fontSize: 14
    }


});
