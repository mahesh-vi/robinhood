import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';
import {DriveListItem} from '../../components/DriveListItem';

import Loader from '../../components/Loader';

import Userservice from '../../services/Userservice';

export default class MyAchivement extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  UNSAFE_componentWillMount = () => {
    this.setState({loading: true});
    Userservice.achivements()
      .then((res) => {
        console.log('Achivements', res);

        this.setState({
          achivements: res.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({loading: false});

        console.log(error);
      });
  };

  renderItem(item) {
    const achivement = item.item;
    return (
      <View>
        <Image
          source={{uri: `${achivement}`}}
          style={{
            marginVertical: 10,
            height: 150,
            width: '100%',
            borderRadius: 5,
          }}
        />
      </View>
    );
  }

  render() {
    return (
      <ScrollView style={styles.mainContainer}>
        <Loader loading={this.state.loading} />
        <View style={{marginHorizontal: 20, marginVertical: 15}}>
          <View style={{flexDirection: 'row'}}>
            <Ionicons
              name={'ios-arrow-back'}
              size={30}
              onPress={() => this.props.navigation.goBack()}
            />

            <View style={{marginLeft: 20}}>
              <Text style={[StyleApp.headerText]}>My Achivements</Text>
              <Text style={[StyleApp.headerSubText]}>
                Check all your achivements hear
              </Text>
            </View>
          </View>
          {this.state.achivements && (
            <Fragment>
              <View
                style={{
                  flex: 1,
                  marginVertical: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#efefef',
                    padding: 20,
                    borderRadius: 8,
                    marginHorizontal: 10,
                  }}>
                  <Text
                    style={[
                      AppStyle.semiBoldFamily,
                      StyleApp.darkGrayColor,
                      StyleApp.font12,
                      {textAlign: 'center'},
                    ]}>
                    Total Drive
                  </Text>
                  <Text
                    style={[
                      StyleApp.lightFont,
                      StyleApp.darkGrayColor,
                      {fontSize: 24, textAlign: 'center'},
                    ]}>
                    {this.state.achivements.total_drive}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#efefef',
                    padding: 20,
                    borderRadius: 8,
                    marginHorizontal: 10,
                  }}>
                  <Text
                    style={[
                      AppStyle.semiBoldFamily,
                      StyleApp.darkGrayColor,
                      StyleApp.font12,
                      {textAlign: 'center'},
                    ]}>
                    Completed Drive
                  </Text>
                  <Text
                    style={[
                      StyleApp.lightFont,
                      StyleApp.darkGrayColor,
                      {fontSize: 24, textAlign: 'center'},
                    ]}>
                    {this.state.achivements.complete_drive}
                  </Text>
                </View>
              </View>
              {!this.state.achivements.image_url && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    borderRadius: 5,
                    margin: 10,
                  }}>
                  <Text>No any achivements.</Text>
                </View>
              )}
              {this.state.achivements.image_url && (
                <FlatList
                  data={this.state.achivements.image_url}
                  renderItem={this.renderItem.bind(this)}
                  keyExtractor={(item) => '' + item}
                  ListEmptyComponent={
                    <View
                      style={[
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#fff',
                          borderRadius: 5,
                          margin: 10,
                          padding: 20,
                        },
                        AppStyle.boxWithShadow,
                      ]}>
                      <Text>No any achivements.</Text>
                    </View>
                  }
                />
              )}
            </Fragment>
          )}
        </View>
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
  boxWithShadow: {
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
});
