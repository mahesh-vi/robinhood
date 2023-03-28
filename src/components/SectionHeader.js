import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback
} from 'react-native';

import StyleApp from '../style/NewAppStyle'



export default SectionHeader = ({ title,action,onPressAction }) => {

   
    return (<View style={{ marginHorizontal: 20, flexDirection: 'row', marginVertical: 10, justifyContent: 'space-between' }}>
    <Text style={[styles.titleText,StyleApp.mediumFont]}>{title}</Text>
    <TouchableWithoutFeedback onPress={
        onPressAction}>
        <Text style={[styles.actionText]}>{action}</Text>
    </TouchableWithoutFeedback>
</View>);
}


const styles = StyleSheet.create({
    titleText:{
        fontFamily: 'Montserrat-Medium',
        color:'#000',
        fontSize:14
    },
    actionText:{
        fontFamily: 'Montserrat-Medium',
        color:'rgba(0,0,0,0.5)',
        fontSize:12,
        
    }
});