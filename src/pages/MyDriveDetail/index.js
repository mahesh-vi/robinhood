import React, { Component, Fragment } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    ScrollView,
    Dimensions,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList

} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppStyle from '../../style/AppStyle';
import Loader from '../../components/Loader';
import DriveDetailView from '../../components/DriveDetailView';
import DriveService from '../../services/DriveService';
import StyleApp from '../../style/NewAppStyle';
import CommonUtil from '../../utils/CommonUtil';

export default class MyDriveDetail extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,         
        };
    }


    UNSAFE_componentWillMount = () => {

        const drive = this.props.navigation.getParam('drive', null);
        console.log(drive);
        let driveId = drive.drive_id || drive.id;

        this.setState({loading:true});
        DriveService.getCompleteDriveById(driveId).then((res) => {
            console.log(res);
            this.setState({loading:false,drive: res.data});
            //this.setState({ drives: res.data });
        }).catch((error) => {
            console.log(error);
            this.setState({loading:false});
            CommonUtil.errorMessage(error,this.props)
        });
    } 



    render() {
        return (
            <ScrollView style={styles.mainContainer}>
                <Loader loading={this.state.loading} />
                <View style={{ marginHorizontal: 20, marginVertical: 15, }}>

                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons name={'ios-arrow-back'} size={30} onPress={() => this.props.navigation.goBack()} />

                        <View style={{ marginLeft: 30 }}>

                             <Text style={[StyleApp.headerText]}>My Drives</Text>
                        <Text style={[StyleApp.headerSubText]}>Check all your drives hear</Text>
                        </View>
                    </View>

                    { this.state.drive && 
                    <DriveDetailView driveType={'mydrive'} driveData={this.state.drive}/>
                    }

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
        height: 30,
        width: 30,

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
    },
    boxWithShadow: {
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 3
    },
    image: {
        height: 120,
        width: '100%',
    },
    map: {
        // ...StyleSheet.absoluteFillObject,
        borderRadius: 5,
        height: 200,
        width: '100%'
    },

});
