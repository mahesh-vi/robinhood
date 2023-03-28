import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Autocomplete from 'react-native-autocomplete-input';
import ImagePicker from 'react-native-image-crop-picker';

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
import TextField from '../../components/TextField';
import InvitePeople from '../../components/InvitePeople';
import UserService from '../../services/Userservice';
import CommonService from '../../services/CommonService';
import DriveService from '../../services/DriveService';
import ExtendDatePicker from '../../components/ExtendDatePicker';
import CityAdminService from '../../services/CityAdminService';
import StyleApp from '../../style/NewAppStyle';
var options = {
  title: 'Select image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
export default class CreateDrive extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userType: null,
      showModal: false,
      driveDetail: this.props.navigation.getParam('drive', null),
      formErrors: {},
      donerList: [],
      query: '',
      album_images: [],
    };
    this.getImage = this.getImage.bind(this);

    console.log('Drive Data', this.props.navigation.getParam('drive', null));
  }

  componentDidMount() {
    const _this = this;
    const {drive_time, date} = this.state.driveDetail;
    console.log(
      Object.assign(this.state.driveDetail, {
        date: date + (drive_time ? ' ' + drive_time : ''),
      }),
    );
    this.setState({
      driveDetail: Object.assign(this.state.driveDetail, {
        date: date + (drive_time ? ' ' + drive_time : ''),
      }),
    });
    Promise.all([UserService.getInviteUserList(), CommonService.getFoodType()])
      .then((res) => {
        console.log('Merge Response', res);
        const inviteList = res[0].data;
        const foodTypes = res[1].data;
        _this.setState({
          inviteList: inviteList,
          foodTypes: foodTypes,
          query: this.state.driveDetail.donar_name,
          doner_id: this.state.driveDetail.doner_id,
        });
        this.filterUser();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  filterUser = () => {
    const _this = this;
    const {inviteList, driveDetail, foodTypes} = this.state;

    inviteList.map((item) => {
      let filter = driveDetail.invite_peoples.filter((i) => i.id == item.id);
      if (filter.length > 0) {
        item.selected = true;
        if (driveDetail.poc == item.id) {
          item.poc = true;
        }
      }
    });

    foodTypes.map((item) => {
      let filter = driveDetail.foodtypes.filter((i) => i.id == item.id);
      if (filter.length > 0) {
        return (item.selected = true);
      }
    });

    _this.setState({inviteList: inviteList, foodTypes: foodTypes});
  };

  createDrive = () => {
    const {inviteList, foodTypes, image_uri, doner_id, query, album_images} =
      this.state;

    // this.props.navigation.navigate('AfterDriveCreated');

    if (inviteList && foodTypes) {
      const selectedInvite = inviteList
        .filter((i) => i.selected)
        .map((i) => i.id);
      const selectedFoodType = foodTypes
        .filter((i) => i.selected)
        .map((i) => i.id);
      const poc = inviteList.filter((i) => i.poc).map((i) => i.id);
      if (Object.keys(this.validateField()).length == 0) {
        this.setState({loading: true});
        CityAdminService.confirmDrive(
          this.state.driveDetail,
          selectedInvite,
          selectedFoodType,
          poc,
          doner_id,
          query,
          album_images,
        )
          .then((res) => {
            console.log(res);
            this.props.screenProps.eventEmitter.emit('DriveUpdate', {count: 1});

            this.setState({loading: false});

            const message =
              this.state.driveDetail.name +
              (this.state.driveDetail.poc
                ? ' drive edit successfully'
                : ' drive confirm successfully.');

            this.props.screenProps.alert({
              title: 'Robinhood',
              body: message,
            });

            this.props.navigation.goBack();
          })
          .catch((error) => {
            console.log(error);
            this.setState({loading: false});
          });
      }
    }
  };

  onSelectFoodType = (index) => {
    const {foodTypes} = this.state;
    foodTypes[index].selected = !foodTypes[index].selected;
    this.setState({foodTypes: foodTypes});
  };

  onClose = (invites) => {
    this.setState({showModal: false, inviteList: invites});
  };

  /**
   * @name getImage
   * @description get drive image from device
   */
  getImage() {
    const _this = this;

    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    }).then((images) => {
      console.log(images);
      let album_images = [..._this.state.album_images, ...images];
      _this.setState({
        album_images: album_images,
      });
    });
  }

  /**
   * @method validateField
   * @description check validation of all user information
   */
  validateField() {
    const {
      name,
      donar_name,
      description,
      no_of_volunteers,
      food_quality,
      pickup_address,
      date,
    } = this.state.driveDetail;
    const {doner_id, query, inviteList, foodTypes} = this.state;

    let fieldValidationErrors = {};

    if (!name) {
      fieldValidationErrors.name = 'Please mention name of drive.';
    }

    if (!query && query !== '') {
      fieldValidationErrors.doner =
        'Please mention doner name of drive or Select Doner from list.';
    }

    if (!date) {
      fieldValidationErrors.date = 'Please mention date of drive.';
    }

    if (!no_of_volunteers) {
      fieldValidationErrors.no_of_volunteers = 'Please mention volunteers.';
    }

    if (!food_quality) {
      fieldValidationErrors.foodQuantity = 'Please mention food quantity.';
    }

    if (!pickup_address) {
      fieldValidationErrors.pickup_address = 'Please mention address.';
    }

    if (!description) {
      fieldValidationErrors.description = 'Please mention description.';
    }

    const selectedInvite = inviteList
      .filter((i) => i.selected)
      .map((i) => i.id);
    const selectedFoodType = foodTypes
      .filter((i) => i.selected)
      .map((i) => i.id);
    if (selectedInvite.length == 0) {
      fieldValidationErrors.invites = 'Please mention at least one invite.';
    } else {
      const poc = inviteList.filter((i) => i.poc);
      if (poc.length == 0 && !this.state.driveDetail.poc) {
        fieldValidationErrors.invites = 'Please assign one POC from invites.';
      }
    }

    if (selectedFoodType.length == 0) {
      fieldValidationErrors.foodTypes =
        'Please mention at least one food type.';
    }

    this.setState({
      formErrors: fieldValidationErrors,
    });
    return fieldValidationErrors;
  }

  renderInvites = (item) => {
    const image = item.image
      ? {
          uri:
            'http://work-updates.com/robinhood/public/uploads/users/' +
            item.image,
        }
      : require('../../assets/images/user_male.png');

    return (
      <Menu key={item.id}>
        <MenuTrigger>
          <View
            style={{
              marginHorizontal: 0,
              paddingHorizontal: 5,
              alignItems: 'center',
            }}
            key={item.id}>
            <Image source={image} style={[styles.avtarImage]} />
            <Text style={{width: 70, textAlign: 'center'}}>
              {item.firstname}
            </Text>
          </View>
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionText: {
              padding: 0,
              fontFamily: 'Montserrat-Medium',
              margin: 0,
            },
          }}>
          {item.id != global.user.id && (
            <MenuOption
              onSelect={() => this.removeRobin(item)}
              text={'Remove'}
            />
          )}
          {!item.poc && global.user.id != this.state.driveDetail.poc && (
            <MenuOption onSelect={() => this.makePOC(item)} text="Make POC" />
          )}
        </MenuOptions>
      </Menu>
    );
  };

  removeRobin = (robin) => {
    const _this = this;
    const {inviteList, driveDetail} = this.state;
    inviteList.map((item) => {
      if (item.id == robin.id) {
        return (item.selected = false);
      }
    });
    _this.setState({inviteList: inviteList});
  };

  makePOC = (robin) => {
    const _this = this;
    const {inviteList, driveDetail} = this.state;
    inviteList.map((item) => {
      if (item.id == robin.id) {
        return (item.poc = true);
      }
      return (item.poc = false);
    });
    _this.setState({
      inviteList: inviteList,
      driveDetail: Object.assign(this.state.driveDetail, {poc: robin.id}),
    });
  };

  /**
   * Find doner name from suggestion
   */
  findFilm = async (query) => {
    //method called everytime when we change the value of the input
    if (query === '' || query.length < 3) {
      //if the query is null then return blank
      return [];
    }

    try {
      const searchDonerList = await CommonService.getDonerList(query);
      console.log(searchDonerList);
      this.setState({donerList: searchDonerList.data});
      //return searchDonerList.data;
      // const { donerList } = this.state;
      // //making a case insensitive regular expression to get similar value from the film json
      // const regex = new RegExp(`${query.trim()}`, 'i');
      // //return the filtered film array according the query from the input
      // return donerList.filter(film => film.firstname.search(regex) >= 0);
    } catch (error) {
      console.log('Error', error);
    }
  };

  render() {
    const imageURL = this.state.image_uri
      ? {uri: this.state.image_uri.uri}
      : this.state.driveDetail.image_url
      ? {uri: this.state.driveDetail.image_url}
      : null;

    const {foodTypes, selectedInvites, inviteList, donerList} = this.state;
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    const {query, album_images} = this.state;
    return (
      <ScrollView style={styles.mainContainer}>
        <Loader loading={this.state.loading} />

        <View
          style={{
            marginHorizontal: 20,
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Ionicons
            name={'ios-arrow-back'}
            size={30}
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={{marginLeft: 30}}>
            <Text style={[StyleApp.headerText]}>Confirm Drive</Text>
            <Text style={[StyleApp.headerSubText]}>
              Confirm the Food Donation Drive
            </Text>
          </View>
        </View>

        <View style={{marginHorizontal: 20}}>
          <TextField
            placeholder={'Name your Drive'}
            style={styles.inputContainer}
            onChangeText={(text) =>
              this.setState({
                driveDetail: Object.assign(this.state.driveDetail, {
                  name: text,
                }),
              })
            }
            value={this.state.driveDetail.name}
          />
          {this.state.formErrors.name && (
            <Text style={[AppStyle.errorText]}>
              {this.state.formErrors.name}
            </Text>
          )}
        </View>

        <View style={{marginHorizontal: 20}}>
          {imageURL && (
            <Image
              source={imageURL}
              style={[{width: 80, height: 80, borderRadius: 40}]}
            />
          )}
          <FlatList
            data={this.state.driveDetail.album_images}
            renderItem={({item, index}) => (
              <View style={{flex: 1, flexDirection: 'column', margin: 1}}>
                <TouchableOpacity key={index} style={{flex: 1}}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: item.image_url,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />

          <FlatList
            data={album_images}
            renderItem={({item, index}) => (
              <View style={{flex: 1, flexDirection: 'column', margin: 1}}>
                <TouchableOpacity key={index} style={{flex: 1}}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: item.path,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />

          <TouchableOpacity
            style={[
              {
                marginVertical: 10,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
              },
              AppStyle.primaryBackgroundColor,
            ]}
            onPress={() => this.getImage()}>
            <Text
              style={{
                color: '#fff',
                textTransform: 'uppercase',
                fontFamily: 'Montserrat-Regular',
              }}>
              Drive Images
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{marginHorizontal: 20, marginTop: 10}}>
          <Text style={[AppStyle.mediumFont, AppStyle.text16]}>
            Invite People
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              flexWrap: 'wrap',
              marginVertical: 10,
            }}>
            {inviteList &&
              inviteList.map((item, index) => {
                return item.selected && this.renderInvites(item);
              })}
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({showModal: true});
              }}>
              <Image
                source={require('../../assets/images/add_rounded.png')}
                style={{marginVertical: 10, width: 40, height: 40}}
                onPress={() => {
                  this.setState({showModal: true});
                }}
              />
            </TouchableWithoutFeedback>
          </View>
          {this.state.formErrors.invites && (
            <Text style={[AppStyle.errorText]}>
              {this.state.formErrors.invites}
            </Text>
          )}
        </View>

        <View style={{marginLeft: 20}}>
          <ExtendDatePicker
            label="Choose date"
            mode="datetime"
            date={new Date(this.state.driveDetail.date)}
            onSelect={(date) => {
              this.setState({
                driveDetail: Object.assign(this.state.driveDetail, {
                  date: date,
                }),
              });
            }}
          />
          {this.state.formErrors.date && (
            <Text style={[AppStyle.errorText]}>
              {' '}
              {this.state.formErrors.date}
            </Text>
          )}
        </View>

        {/* <View style={{ margin: 20 }}>
                    <Text style={[AppStyle.mediumFont, AppStyle.text14]}>Donar Name</Text>
                    <TextInput
                        style={[{ borderBottomWidth: 1 / 2, borderColor: 'rgba(0,0,0,0.5)', padding: 0, maxHeight: 50 }, AppStyle.regularFont]}
                        multiline={true}
                        onChangeText={(text) => this.setState({ driveDetail: Object.assign(this.state.driveDetail, { donar_name: text }) })}
                        value={this.state.driveDetail.donar_name} />
                    {this.state.formErrors.donar_name && <Text style={[AppStyle.errorText]}> {this.state.formErrors.donar_name}</Text>}
                </View> */}

        <View style={{margin: 20}}>
          {/* <PickerDropdown
                        placeholder={'Doner'}
                        data={this.state.donerList}
                        value={this.state.driveDetail.doner_id}
                        style={{ backgroundColor: '#fff', borderBottomWidth: 0.5 }}
                        labelProps={['firstname', 'lastname']}
                        onChange={(item) => {
                            console.log("chan", item)
                            const donerName = this.state.donerList.find((i) => i.id == item)
                            console.log(donerName)
                            this.setState({ driveDetail: Object.assign(this.state.driveDetail, { doner_id: item, donerName: donerName.firstname }) });
                        }} /> */}

          <Text style={[AppStyle.mediumFont, AppStyle.text14]}>Donar Name</Text>

          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            containerStyle={[styles.autocompleteContainer]}
            inputContainerStyle={[styles.autoInputContainer]}
            listStyle={[styles.listContainerStyle]}
            style={[AppStyle.mediumFont, AppStyle.text14, {padding: 0}]}
            data={
              donerList.length === 1 &&
              comp(query, donerList[0].firstname + '' + donerList[0].lastname)
                ? []
                : donerList
            }
            defaultValue={query}
            onChangeText={(text) => {
              this.setState({query: text, doner_id: undefined});
              this.findFilm(text);
            }}
            renderItem={({item}) => (
              //you can change the view you want to show in suggestion from here
              <TouchableOpacity
                key={'' + item.id + ''}
                onPress={() => {
                  this.setState({
                    doner_id: item.id,
                    query: item.firstname + ' ' + item.lastname,
                  });
                  this.findFilm(item.firstname + ' ' + item.lastname);
                }}>
                <Text style={[StyleApp.regularFont, StyleApp.font16]}>
                  {item.firstname} {item.lastname}
                </Text>
              </TouchableOpacity>
            )}
          />
          {this.state.formErrors.doner && (
            <Text style={[AppStyle.errorText]}>
              {this.state.formErrors.doner}
            </Text>
          )}
        </View>

        <View style={{margin: 20}}>
          <Text style={[AppStyle.mediumFont, AppStyle.text14]}>
            Pickup Address
          </Text>
          <TextInput
            style={[
              {
                borderBottomWidth: 1 / 2,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 0,
                maxHeight: 50,
              },
              AppStyle.regularFont,
            ]}
            multiline={true}
            onChangeText={(text) =>
              this.setState({
                driveDetail: Object.assign(this.state.driveDetail, {
                  pickup_address: text,
                }),
              })
            }
            value={this.state.driveDetail.pickup_address}
          />
        </View>

        <View style={{margin: 20, flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Text style={[AppStyle.mediumFont, AppStyle.text14]}>
              Food Quantity
            </Text>
            <TextInput
              style={[
                {
                  borderBottomWidth: 0.5,
                  borderColor: 'rgba(0,0,0,0.5)',
                  padding: 0,
                  maxHeight: 50,
                },
                AppStyle.regularFont,
              ]}
              onChangeText={(text) =>
                this.setState({
                  driveDetail: Object.assign(this.state.driveDetail, {
                    food_quality: text,
                  }),
                })
              }
              value={this.state.driveDetail.food_quality}
            />
            {this.state.formErrors.food_quality && (
              <Text style={[AppStyle.errorText]}>
                {' '}
                {this.state.formErrors.food_quality}
              </Text>
            )}
          </View>

          <View style={{flex: 1, marginLeft: 5}}>
            <Text style={[AppStyle.mediumFont, AppStyle.text14]}>
              No. of Volunteers
            </Text>
            <TextInput
              keyboardType={'number-pad'}
              placeholder={'Min 3+'}
              style={[
                {
                  borderBottomWidth: 0.5,
                  borderColor: 'rgba(0,0,0,0.5)',
                  padding: 0,
                  maxHeight: 50,
                },
                AppStyle.regularFont,
              ]}
              onChangeText={(text) =>
                this.setState({
                  driveDetail: Object.assign(this.state.driveDetail, {
                    no_of_volunteers: text,
                  }),
                })
              }
              value={this.state.driveDetail.no_of_volunteers.toString()}
            />
            {this.state.formErrors.no_of_volunteers && (
              <Text style={[AppStyle.errorText]}>
                {' '}
                {this.state.formErrors.no_of_volunteers}
              </Text>
            )}
          </View>
        </View>

        <View style={{marginHorizontal: 20, marginVertical: 10}}>
          <Text style={[AppStyle.regularFont, AppStyle.text16]}>
            Choose Food Type
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5,
              flexWrap: 'wrap',
              flex: 1,
            }}>
            {foodTypes &&
              foodTypes.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      borderRadius: 25,
                      padding: 5,
                      backgroundColor: '#d7def6',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onPress={() => this.onSelectFoodType(index)}>
                    <View
                      style={{
                        backgroundColor: '#00f',
                        borderRadius: 15,
                        height: 25,
                        width: 25,
                      }}>
                      {item.selected && (
                        <View style={{borderRadius: 15}}>
                          <FeatherIcon
                            name={'check'}
                            size={20}
                            style={{
                              color: '#fff',
                              borderRadius: 20,
                              padding: 2.5,
                            }}
                          />
                        </View>
                      )}
                    </View>

                    <Text
                      style={[
                        AppStyle.regularFont,
                        {fontSize: 12, color: '#1251cf', marginHorizontal: 5},
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
          {this.state.formErrors.foodTypes && (
            <Text style={[AppStyle.errorText]}>
              {this.state.formErrors.foodTypes}
            </Text>
          )}
        </View>

        <View style={{marginHorizontal: 20, marginTop: 10}}>
          <Text style={[AppStyle.mediumFont, AppStyle.text14]}>
            Write short description
          </Text>

          <TextInput
            style={[
              AppStyle.regularFont,
              {
                justifyContent: 'flex-start',
                height: 100,
                textAlignVertical: 'top',
                borderBottomWidth: 1,
                borderBottomColor: '#dedede',
              },
            ]}
            underlineColorAndroid="transparent"
            placeholder="Message..."
            placeholderTextColor="grey"
            numberOfLines={3}
            multiline={true}
            onChangeText={(text) =>
              this.setState({
                driveDetail: Object.assign(this.state.driveDetail, {
                  description: text,
                }),
              })
            }
            value={this.state.driveDetail.description}
          />

          {this.state.formErrors.description && (
            <Text style={[AppStyle.errorText]}>
              {' '}
              {this.state.formErrors.description}
            </Text>
          )}

          {this.state.formErrors.general && (
            <Text style={[AppStyle.errorText]}>
              {' '}
              {this.state.formErrors.general}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            {
              left: '10%',
              marginVertical: 20,
              height: 44,
              width: '80%',
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
            },
            AppStyle.primaryBackgroundColor,
          ]}
          onPress={() => this.createDrive()}>
          <Text
            style={{
              color: '#fff',
              textTransform: 'uppercase',
              fontFamily: 'Montserrat-Bold',
            }}>
            {this.state.driveDetail.poc ? 'Edit Drive' : 'Confirm DRIVE'}
          </Text>
        </TouchableOpacity>

        <InvitePeople
          showModal={this.state.showModal}
          inviteList={this.state.inviteList}
          onClose={this.onClose}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconImage: {
    height: 80,
    width: 80,
  },
  formContainer: {
    left: '10%',
    marginTop: 40,
  },
  seperation: {
    width: '80%',
    height: 20,
    left: 40,
    marginTop: 30,
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: 'rgba(250,250,254,1)',
    marginBottom: 10,
    width: '100%',
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  avtarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    borderWidth: 0,
    borderBottomWidth: 0.5,
  },
  listContainerStyle: {
    margin: 0,
    borderWidth: 0,
  },
  image: {
    height: 60,
    width: '100%',
  },
});
