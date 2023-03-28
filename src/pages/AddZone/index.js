import React, {Component} from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';

import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';
import PickerDropdown from '../../components/PickerDropdown';
import TextField from '../../components/TextField';

const window = Dimensions.get('window');

export default class AddZone extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userType: null,
    };
  }

  render() {
    return (
      <ScrollView style={styles.mainContainer}>
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
            <Text style={[StyleApp.headerText]}>Add Zone</Text>
            <Text style={[StyleApp.headerSubText]}>Add your prefered Zone</Text>
          </View>
        </View>

        <View style={{marginHorizontal: 20}}>
          <TextField
            placeholder={'Name of Zone'}
            style={styles.inputContainer}
          />
        </View>

        <View style={{marginLeft: 20}}>
          <Text style={[AppStyle.regularFont, AppStyle.text16]}>
            Choose State
          </Text>
          <PickerDropdown />
        </View>

        <View style={{marginLeft: 20}}>
          <Text style={[AppStyle.regularFont, AppStyle.text16]}>
            Choose City
          </Text>
          <PickerDropdown />
        </View>

        <View style={{marginHorizontal: 20}}>
          <Text style={[AppStyle.regularFont, AppStyle.text16]}>Map Areas</Text>
          <View
            style={{
              minHeight: 50,
              borderBottomWidth: 1,
              borderColor: 'rgba(0,0,0,0.5)',
            }}
          />
          <View style={{flex: 1, flexWrap: 'wrap', flexDirection: 'row'}}>
            <View
              style={{
                marginTop: 10,
                borderRadius: 25,
                backgroundColor: '#d7def6',
                padding: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  AppStyle.regularFont,
                  {fontSize: 14, color: '#1251cf', marginHorizontal: 5},
                ]}>
                Meeting
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: 5,
                marginTop: 10,
                borderRadius: 25,
                backgroundColor: '#edf9f0',
                padding: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  AppStyle.regularFont,
                  {fontSize: 14, color: '#74c875', marginHorizontal: 10},
                ]}>
                Meeting
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                borderRadius: 25,
                backgroundColor: '#d7def6',
                padding: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  AppStyle.regularFont,
                  {fontSize: 14, color: '#1251cf', marginHorizontal: 5},
                ]}>
                Meeting
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: 5,
                marginTop: 10,
                borderRadius: 25,
                backgroundColor: '#edf9f0',
                padding: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  AppStyle.regularFont,
                  {fontSize: 16, color: '#74c875', marginHorizontal: 5},
                ]}>
                Meeting
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                borderRadius: 25,
                backgroundColor: '#d7def6',
                padding: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  AppStyle.regularFont,
                  {fontSize: 16, color: '#1251cf', marginHorizontal: 5},
                ]}>
                Meeting
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: 5,
                marginTop: 10,
                borderRadius: 25,
                backgroundColor: '#edf9f0',
                padding: 10,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  AppStyle.regularFont,
                  {fontSize: 16, color: '#74c875', marginHorizontal: 5},
                ]}>
                Meeting
              </Text>
            </View>
          </View>
        </View>

        <View style={{marginHorizontal: 20, marginTop: 10}}>
          <Text style={[AppStyle.regularFont, AppStyle.text16]}>
            Write short description
          </Text>
          <TextInput
            style={[
              {
                borderBottomWidth: 1,
                borderColor: 'rgba(0,0,0,0.5)',
                padding: 0,
                maxHeight: 50,
              },
              AppStyle.regularFont,
            ]}
            multiline={true}
            numberOfLines={3}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
        </View>

        <View style={{marginHorizontal: 20, marginTop: 10}}>
          <Text style={[AppStyle.regularFont, AppStyle.text16]}>
            Invite People
          </Text>
          <FeatherIcon name={'plus'} size={30} color={'rgab(0,0,0,0.5)'} />
        </View>

        <TouchableOpacity
          style={{
            left: '10%',
            marginVertical: 20,
            height: 44,
            width: '80%',
            borderRadius: 22,
            backgroundColor: '#00CA9D',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#fff',
              textTransform: 'uppercase',
              fontFamily: 'Montserrat-Regular',
            }}>
            ADD ZONE
          </Text>
        </TouchableOpacity>
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
    fontSize: 14,
  },
});
