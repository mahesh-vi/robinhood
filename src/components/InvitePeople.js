import React, {Component} from 'react';
import {
  View,
  StatusBar,
  Alert,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  FlatList,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AppStyle from '../style/AppStyle';
import UserService from '../services/Userservice';

export default class InvitePeople extends Component {
  constructor(props) {
    super(props);
    this.state = {userList: [], selectedUser: []};
  }

  UNSAFE_componentWillReceiveProps = async (props) => {
    let _this = this;
    _this.mainUserList = props.inviteList;
    _this.setState({
      userList: props.inviteList,
      selectedUser: props.selectedInvite || [],
    });
    // _this.setState({ selectedUser: props.selectedInvite })
    // UserService.getInviteUserList().then((res) => {
    //     console.log(res);
    //     const { data } = res;
    //     _this.setState({ userList: data });
    //     _this.filterUser();
    // }).catch((error) => {
    //     console.log(error);
    // });
  };

  onSelectUser = (index, userDetail) => {
    const _this = this;
    const selectedUser = this.state.selectedUser;
    selectedUser.push(userDetail.id);
    this.setState({selectedUser: selectedUser});
    _this.filterUser();
  };

  filterUser = () => {
    const _this = this;
    const {userList, selectedUser} = this.state;

    _this.mainUserList.map((item) => {
      let filter = selectedUser.filter((i) => i == item.id);
      if (filter.length > 0) return (item.selected = true);
    });
    _this.setState({userList: userList});
  };

  searchText = (text) => {
    const _this = this;
    const searchText = text.toLowerCase();

    let filter = _this.mainUserList.filter((i) => {
      return (
        i.firstname.toLowerCase().indexOf(searchText) >= 0 ||
        i.lastname.toLowerCase().indexOf(searchText) >= 0
      );
    });
    console.log(filter);

    _this.setState({userList: filter});
  };

  renderItem = (item) => {
    const userDetail = item.item;
    const image = userDetail.image
      ? {
          uri:
            'http://work-updates.com/robinhood/public/uploads/users/' +
            userDetail.image,
        }
      : require(`../assets/images/user_male.png`);
    return (
      <View style={{marginVertical: 5, width: '100%'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <View>
            <Image
              source={image}
              style={[{width: 50, height: 50, borderRadius: 25}]}
            />
          </View>

          <View style={{marginLeft: 5}}>
            <Text
              style={[
                AppStyle.semiBoldFamily,
                {fontSize: 14, marginVertical: 2},
              ]}>
              {userDetail.firstname} {userDetail.lastname}
            </Text>
            <Text
              style={[
                AppStyle.mediumFont,
                {fontSize: 10, marginVertical: 2, marginLeft: 5},
              ]}></Text>
          </View>
          {!userDetail.selected && (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
                right: 10,
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 10,
                paddingHorizontal: 5,
              }}
              onPress={() => this.onSelectUser(item.index, userDetail)}>
              <FeatherIcon name={'plus'} size={20} style={AppStyle.grayColor} />

              <Text
                style={[
                  AppStyle.mediumFont,
                  AppStyle.grayColor,
                  {fontSize: 14, marginVertical: 2},
                ]}>
                Add
              </Text>
            </TouchableOpacity>
          )}
          {userDetail.selected && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                position: 'absolute',
                right: 10,
                backgroundColor: '#edf9f0',
                borderRadius: 10,
                paddingHorizontal: 5,
              }}>
              <FeatherIcon
                name={'check'}
                size={20}
                style={{color: '#74c875'}}
              />

              <Text
                style={[
                  AppStyle.mediumFont,
                  {color: '#74c875', fontSize: 14, marginVertical: 2},
                ]}>
                Added
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{alignItems: 'center', flex: 1}}>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.props.showModal}
          onRequestClose={() => {
            this.props.onClose(this.mainUserList);
          }}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.1)'}}>
            <View style={[styles.mainView, AppStyle.boxWithShadow]}>
              <View
                style={{
                  flexDirection: 'row',
                  margin: 20,
                  marginBottom: 0,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={[AppStyle.mediumFont, AppStyle.text14]}>
                  Invite People
                </Text>
                <FeatherIcon
                  name={'chevron-down'}
                  size={30}
                  color={'#000'}
                  onPress={() => {
                    this.props.onClose(this.mainUserList);
                  }}
                />
              </View>
              <View
                style={{
                  marginHorizontal: 20,
                  justifyContent: 'center',
                  borderBottomWidth: 1,
                  borderBottomColor: 'rgba(0,0,0,0.3)',
                }}>
                <FeatherIcon
                  name={'search'}
                  size={25}
                  style={{position: 'absolute', left: 0}}
                />
                <TextInput
                  style={[
                    {left: 40, width: '80%'},
                    AppStyle.regularFont,
                    AppStyle.text16,
                  ]}
                  placeholder="Search by Name"
                  onChangeText={(text) => {
                    this.searchText(text);
                  }}
                />
              </View>
              <View style={{marginHorizontal: 20}}>
                <FlatList
                  style={{marginBottom: 160, marginTop: 10}}
                  contentInsetAdjustmentBehavior="automatic"
                  data={this.state.userList}
                  renderItem={this.renderItem.bind(this)}
                  keyExtractor={(item) => item.id + ''}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '95%',
    top: '15%',
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
