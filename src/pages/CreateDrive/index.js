import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback

} from 'react-native';
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-picker';
import Autocomplete from 'react-native-autocomplete-input';
import Menu, {
    MenuProvider,
    MenuTrigger,
    MenuOptions,
    MenuOption,
    renderers,
} from 'react-native-popup-menu';

import PickerDropdown from '../../components/PickerDropdown';

import Loader from '../../components/Loader';
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';
import TextField from '../../components/TextField';
import InvitePeople from '../../components/InvitePeople';
import UserService from '../../services/Userservice';
import CommonService from '../../services/CommonService';
import DriveService from '../../services/DriveService';
import ExtendDatePicker from '../../components/ExtendDatePicker';


var options = {
    title: 'Select image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
export default class CreateDrive extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            userType: null,
            showModal: false,
            driveDetail: {},
            formErrors: {},
            donerList: [],
            query: ''
        };
        this.getImage = this.getImage.bind(this);
    }

    componentDidMount() {
        const _this = this;

        Promise.all([UserService.getInviteUserList(), CommonService.getFoodType(), CommonService.getDonerList()]).then((res) => {
            console.log('Merge Response', res);
            const inviteList = res[0].data;
            const foodTypes = res[1].data;
            // const donerList = res[2].data;
            _this.setState({ inviteList: inviteList, foodTypes: foodTypes }, () => {

            });
        }).catch((error) => {
            console.log(error);
        });

    }

    createDrive = () => {
        const { inviteList, foodTypes, image_uri, doner_id, query } = this.state;
        console.log(this.state);
        // this.props.navigation.navigate('AfterDriveCreated');

        if (inviteList && foodTypes) {

            const selectedInvite = inviteList.filter(i => i.selected).map(i => i.id);
            const selectedFoodType = foodTypes.filter(i => i.selected).map(i => i.id);
            console.log(this.state.driveDetail, selectedFoodType, selectedInvite);
            if ((Object.keys(this.validateField()).length == 0)) {
                this.setState({ loading: true });
                DriveService.addDrive(this.state.driveDetail, selectedInvite, selectedFoodType, doner_id, query, image_uri).then((res) => {
                    console.log(res);
                    this.setState({ loading: false });
                    this.props.navigation.navigate('AfterDriveCreated');
                }).catch((error) => {
                    console.log(error);
                    this.setState({ loading: false });
                })
            }
        }
    }

    onSelectFoodType = (index) => {
        const { foodTypes } = this.state;
        foodTypes[index].selected = !foodTypes[index].selected;
        this.setState({ foodTypes: foodTypes });
    }

    onClose = (invites) => {
        this.setState({ showModal: false, inviteList: invites });
    }

    /**
     * @name getImage
     * @description get drive image from device
     */
    getImage() {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Image picker response', response);
            const data = response;
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let imageData = data;
                delete imageData['data'];
                this.setState(
                    {
                        image_uri: imageData
                    }
                );
            }

        });

    }

    renderInvites = (item) => {
        const image = item.image ? { uri: "http://work-updates.com/robinhood/public/uploads/users/" + item.image } : require(`../../assets/images/user_male.png`);


        return (<Menu key={item.id}>
            <MenuTrigger>
                <View style={{ marginHorizontal: 0, paddingHorizontal: 5, alignItems: 'center' }} key={item.id}>
                    <Image source={image} style={[styles.avtarImage]} />
                    <Text style={{ width: 70, textAlign: 'center' }}>{item.firstname}</Text></View>
            </MenuTrigger>
            <MenuOptions customStyles={{ optionText: { padding: 0, fontFamily: 'Montserrat-Medium', margin: 0 } }}>
                 <MenuOption onSelect={() => this.removeRobin(item)} text={'Remove'} />              
            </MenuOptions>
        </Menu>);


    }

    removeRobin = (robin) => {
        const _this = this;
        const { inviteList, driveDetail } = this.state;
        inviteList.map(item => {

            if (item.id == robin.id)
                return item.selected = false;
        });
        _this.setState({ inviteList: inviteList });

    }

    /**
    * @method validateField
    * @description check validation of all user information
    */
    validateField() {
        const { name, donerName, description, numberOfVolunteers, foodQuantity, address, date } = this.state.driveDetail;
        const { doner_id, query,inviteList,foodTypes } = this.state;
        let fieldValidationErrors = {};


        if (!name) {
            fieldValidationErrors.name = "Please mention name of drive.";
        }

        if ((!query && query == '')) {
            fieldValidationErrors.doner = "Please mention doner name of drive or Select Doner from list.";
        }

        if (!date) {
            fieldValidationErrors.date = "Please mention date of drive.";
        }else if(moment(date).isBefore(moment())){
            fieldValidationErrors.date = "Drive date should not be past.";

        }


        if (!numberOfVolunteers) {
            fieldValidationErrors.numberOfVolunteers = "Please mention volunteers.";
        }else if(numberOfVolunteers<3){
            fieldValidationErrors.numberOfVolunteers = "Volunteers not be less than 3.";
        }


        if (!foodQuantity) {
            fieldValidationErrors.foodQuantity = "Please mention food quantity.";
        }

        if (!address) {
            fieldValidationErrors.address = "Please mention address."
        }

        if (!description) {
            fieldValidationErrors.description = "Please mention description."
        }
        const selectedInvite = inviteList.filter(i => i.selected).map(i => i.id);
        const selectedFoodType = foodTypes.filter(i => i.selected).map(i => i.id);
        if(selectedInvite.length==0){
            fieldValidationErrors.invites = "Please mention at least one invite.";
        }

        if(selectedFoodType.length==0){
            fieldValidationErrors.foodTypes = "Please mention at least one food type.";
        }

        this.setState({
            formErrors: fieldValidationErrors
        });
        console.log(fieldValidationErrors);
        return fieldValidationErrors;

    }


    findFilm = async (query) => {
        //method called everytime when we change the value of the input
        if (query === '' || query.length < 3) {
            //if the query is null then return blank
            return [];
        }

        if(this.state.doner_id){
            return [];
        }

        try {

            const searchDonerList = await CommonService.getDonerList(query);
            console.log(searchDonerList,this.state.doner_id);
            this.setState({ donerList: searchDonerList.data });
     
        } catch (error) { console.log('Error', error); }

    }

    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal()
        .then((place) => {
            console.log(place);
            // place represents user's selection from the
            // suggestions and it is a simplified Google Place object.
        })
        .catch(error => console.log(error.message));  // error is a Javascript Error object
      }

    render() {

        const { foodTypes, selectedInvites, inviteList, donerList,image_uri } = this.state;
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        const { query } = this.state;
        // const films = this.findFilm(query);

        return (
            <ScrollView style={styles.mainContainer}>
                <Loader loading={this.state.loading} />

                <View style={{ marginHorizontal: 20, marginVertical: 15, flexDirection: 'row', alignItems: 'center', }}>
                    <Ionicons name={'ios-arrow-round-back'} size={40} onPress={() => this.props.navigation.navigate('Dashboard')} />
                    <View style={{ marginLeft: 30 }}>
                        <Text style={[StyleApp.headerText]}>Create Drive</Text>
                        <Text style={[StyleApp.headerSubText]}>Create the Food Donation Drive</Text>
                    </View>
                </View>

              

                <View style={{ marginHorizontal: 20 }}>
                    <TextField
                        placeholder={'Name your Drive'}
                        style={styles.inputContainer}
                        onChangeText={(text) => this.setState({ driveDetail: Object.assign(this.state.driveDetail, { name: text }) })}
                        value={this.state.driveDetail.name}
                    />
                    {this.state.formErrors.name && <Text style={[AppStyle.errorText]}>{this.state.formErrors.name}</Text>}
                </View>

                <View style={{ marginHorizontal: 20 }}>
                    {image_uri &&
                <Image style={styles.image}
                                        source={{
                                            uri: image_uri.uri,
                                        }}
                                    />}
                    <TouchableOpacity style={[{ marginVertical: 0, height: 30, alignItems: 'center', justifyContent: 'center' }, AppStyle.primaryBackgroundColor]}
                        onPress={() => this.getImage()}>
                        <Text style={{ color: '#fff', textTransform: 'uppercase', fontFamily: 'Montserrat-Regular' }}>Drive Image</Text>
                    </TouchableOpacity>
                </View>



                <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                    <Text style={[AppStyle.mediumFont, AppStyle.text16]}>Invite People</Text>
                    <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', marginVertical: 10 }}>
                        {/* {inviteList && inviteList.map((item, index) => {
                            const image = item.image ? { uri: "http://work-updates.com/robinhood/public/uploads/users/" + item.image } : require(`../../assets/images/user_male.png`)
                            return (item.selected &&
                                <View style={{ marginHorizontal: 0, paddingHorizontal: 5, alignItems: 'center' }} key={item.id}>
                                    <Image source={image} style={[styles.avtarImage]} />
                                    <Text style={{ width: 70, textAlign: 'center' }}>{item.firstname}</Text>
                                </View>)
                        })} */}

{inviteList && inviteList.map((item, index) => {
                            return (item.selected && this.renderInvites(item))
                        })}
                        <TouchableWithoutFeedback onPress={() => { this.setState({ showModal: true }) }} >
                            <Image source={require('../../assets/images/add_rounded.png')} style={{ marginVertical: 10, width: 40, height: 40 }} onPress={() => { this.setState({ showModal: true }) }} />
                        </TouchableWithoutFeedback>
                    </View>
                    {this.state.formErrors.invites && <Text style={[AppStyle.errorText]}>{this.state.formErrors.invites}</Text>}

                </View>

                <View style={{ marginLeft: 20 }}>
                    <ExtendDatePicker 
                    label="Choose date" 
                    mode="datetime" 
                    minimumDate={new Date()}
                    date={this.state.driveDetail.date}
                        onSelect={(date) => {
                            this.setState({ driveDetail: Object.assign(this.state.driveDetail, { date: date }) })
                        }}
                    />
                    {this.state.formErrors.date && <Text style={[AppStyle.errorText]}>{this.state.formErrors.date}</Text>}
                </View>

                {/* <View style={{ margin: 20 }}>
                    <Text style={[AppStyle.mediumFont, AppStyle.text14]}>Donar Name</Text>
                    <TextInput
                        style={[{ borderBottomWidth: 1 / 2, borderColor: 'rgba(0,0,0,0.5)', padding: 0, maxHeight: 50 }, AppStyle.regularFont]}
                        multiline={true}
                        onChangeText={(text) => this.setState({ driveDetail: Object.assign(this.state.driveDetail, { donerName: text }) })}
                        value={this.state.driveDetail.donerName} />
                    {this.state.formErrors.donerName && <Text style={[AppStyle.errorText]}>{this.state.formErrors.donerName}</Text>}
                </View> */}


                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <Text style={[AppStyle.mediumFont, AppStyle.text14]}>Donar Name</Text>

                    {/* <PickerDropdown
                        placeholder={'Doner'}
                        data={this.state.donerList}
                        value={this.state.driveDetail.doner_id}
                        style={{backgroundColor:'#fff',borderBottomWidth:0.5}}
                        labelProps={['firstname','lastname']}
                        onChange={(item) => {       
                            console.log("chan",item)       
                            const donerName = this.state.donerList.find((i)=>i.id==item)
                            console.log(donerName)
                            this.setState({ driveDetail: Object.assign(this.state.driveDetail, { doner_id: item,donerName:donerName.firstname }) });
                        }} /> */}

                    <Autocomplete
                        autoCapitalize="none"
                        autoCorrect={false}
                        containerStyle={[styles.autocompleteContainer]}
                        inputContainerStyle={[styles.autoInputContainer]}
                        listStyle={[styles.listContainerStyle]}
                        style={[AppStyle.mediumFont, AppStyle.text14, { padding: 0 }]}
                        //data to show in suggestion
                        // data={films.length === 1 && comp(query, films[0].firstname) ? [] : films}
                        data={donerList.length === 1 && comp(query, donerList[0].firstname + "" + donerList[0].lastname) ? [] : donerList}
                        //default value if you want to set something in input
                        defaultValue={query}
                        /*onchange of the text changing the state of the query which will trigger
                        the findFilm method to show the suggestions*/
                        onChangeText={text => { this.setState({ query: text, doner_id: undefined }); this.findFilm(text); }}
                        //   placeholder="Doner name"
                        renderItem={({ item }) => (
                            //you can change the view you want to show in suggestion from here
                            <TouchableOpacity key={item.id + ""} onPress={() => {

                                this.setState({ donerList:[],doner_id: item.id, query: item.firstname + " " + (item.lastname||'') });
                                // this.findFilm(item.firstname + " " + item.lastname);
                            }

                            }>
                                <Text style={[StyleApp.regularFont, StyleApp.font16]}>
                                    {item.firstname} {item.lastname}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                    {this.state.formErrors.doner && <Text style={[AppStyle.errorText]}>{this.state.formErrors.doner}</Text>}

                </View>

                <View style={{ margin: 20 }}>
                    <Text style={[AppStyle.mediumFont, AppStyle.text14]}>Pickup Address</Text>
                    <TextInput
                        style={[{ borderBottomWidth: 1 / 2, borderColor: 'rgba(0,0,0,0.5)', padding: 0, maxHeight: 50 }, AppStyle.regularFont]}
                        multiline={true}
                        onChangeText={(text) => this.setState({ driveDetail: Object.assign(this.state.driveDetail, { address: text }) })}
                        value={this.state.driveDetail.address} />
                </View>

                <View style={{ margin: 20, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[AppStyle.mediumFont, AppStyle.text14]}>Food Quantity</Text>
                        <TextInput
                            style={[{ borderBottomWidth: 0.5, borderColor: 'rgba(0,0,0,0.5)', padding: 0, maxHeight: 50 }, AppStyle.regularFont]}
                            onChangeText={(text) => this.setState({ driveDetail: Object.assign(this.state.driveDetail, { foodQuantity: text }) })}
                            value={this.state.driveDetail.foodQuantity} />
                        {this.state.formErrors.foodQuantity && <Text style={[AppStyle.errorText]}>{this.state.formErrors.foodQuantity}</Text>}
                    </View>

                    <View style={{ flex: 1, marginLeft: 5 }}>
                        <Text style={[AppStyle.mediumFont, AppStyle.text14]}>No. of Volunteers</Text>
                        <TextInput
                            keyboardType={'number-pad'}
                            placeholder={'Min 3+'}
                            style={[{ borderBottomWidth: 0.5, borderColor: 'rgba(0,0,0,0.5)', padding: 0, maxHeight: 50 }, AppStyle.regularFont]}
                            onChangeText={(text) => this.setState({ driveDetail: Object.assign(this.state.driveDetail, { numberOfVolunteers: text }) })}
                            value={this.state.driveDetail.numberOfVolunteers} />
                        {this.state.formErrors.numberOfVolunteers && <Text style={[AppStyle.errorText]}>{this.state.formErrors.numberOfVolunteers}</Text>}

                    </View>

                </View>


                <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <Text style={[AppStyle.regularFont, AppStyle.text16]}>Choose Food Type</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5, flexWrap: 'wrap', flex: 1 }}>

                        {foodTypes && foodTypes.map((item, index) => {
                            return (
                                <TouchableOpacity key={item.id} style={{ flexDirection: 'row', marginTop: 10, borderRadius: 25, padding: 5, backgroundColor: '#d7def6', justifyContent: 'space-between', alignItems: 'center' }}
                                    onPress={() => this.onSelectFoodType(index)}
                                >
                                    <View style={{ backgroundColor: '#00f', borderRadius: 15, height: 25, width: 25 }}>
                                        {item.selected &&
                                            <View style={{ borderRadius: 15 }} >
                                                <FeatherIcon name={'check'} size={20} style={{ color: '#fff', borderRadius: 20, padding: 2.5 }} />
                                            </View>
                                        }
                                    </View>

                                    <Text style={[AppStyle.regularFont, { fontSize: 12, color: '#1251cf', marginHorizontal: 5 }]}>{item.name}</Text>
                                </TouchableOpacity>)
                        })}

                    </View>
                    {this.state.formErrors.foodTypes && <Text style={[AppStyle.errorText]}>{this.state.formErrors.foodTypes}</Text>}
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                    <Text style={[AppStyle.mediumFont, AppStyle.text14]}>Write short description</Text>

                    <TextInput
                        style={[AppStyle.regularFont, { justifyContent: 'flex-start', height: 100, textAlignVertical: 'top', borderBottomWidth: 1, borderBottomColor: '#dedede' }]}
                        underlineColorAndroid="transparent"
                        placeholder="Message..."
                        placeholderTextColor="grey"
                        numberOfLines={3}
                        multiline={true}
                        onChangeText={(text) => this.setState({ driveDetail: Object.assign(this.state.driveDetail, { description: text }) })}
                        value={this.state.driveDetail.description}
                    />

                    {this.state.formErrors.description && <Text style={[AppStyle.errorText]}>{this.state.formErrors.description}</Text>}

                </View>



                <TouchableOpacity style={[{ left: "10%", marginVertical: 20, height: 44, width: "80%", borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, AppStyle.primaryBackgroundColor]}
                    onPress={() => this.createDrive()}
                >
                    <Text style={{ color: '#fff', textTransform: 'uppercase', fontFamily: 'Montserrat-Regular' }}>POST DRIVE</Text>
                </TouchableOpacity>

                <InvitePeople showModal={this.state.showModal} inviteList={this.state.inviteList} onClose={this.onClose} />

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

        backgroundColor: 'rgba(250,250,254,1)', marginBottom: 10, width: '100%', fontSize: 16
    },
    avtarImage: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    autocompleteContainer: {
        backgroundColor: '#ffffff',
        borderWidth: 0,


    },

    itemText: {
        fontSize: 15,
        paddingTop: 5,
        paddingBottom: 5,
        margin: 2,
    },
    autoInputContainer: {
        borderWidth: 0, borderBottomWidth: 0.5,
    },
    listContainerStyle: {
        margin: 0,
        borderWidth: 0
    },
    image:{
        width:'100%',
        height:120,
        marginVertical:5
    }
});
