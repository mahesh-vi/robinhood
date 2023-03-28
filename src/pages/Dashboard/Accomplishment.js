import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import AppStyle from '../../style/AppStyle';

import UserService from '../../services/Userservice';
import SectionHeader from '../../components/SectionHeader';

export default class Accomplishment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    UserService.achivements()
      .then((res) => {
        if (res.data.image_url) {
          this.setState({
            achivements: res.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (!this.state.achivements) {
      return null;
    }
    return (
      <View>
        <SectionHeader
          title="My Accomplishments"
          action="Show More"
          onPressAction={() => {
            this.props.navigation.navigate('MyAchivement');
          }}
        />

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginLeft: 10, marginVertical: 10}}>
          {this.state.achivements.image_url &&
            this.state.achivements.image_url.map((achivement, index) => {
              return (
                <View key={index} style={{marginHorizontal: 10}}>
                  <Image
                    source={{uri: achivement}}
                    style={{height: 150, width: 300, borderRadius: 5}}
                  />
                </View>
              );
            })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderColor: '#71c89e',
    borderWidth: 0.75,
  },
  formContainer: {
    left: '10%',
    marginTop: 20,
  },

  avtarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
});
