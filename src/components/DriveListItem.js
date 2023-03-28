import React from 'react'
import { View, Text, TouchableOpacity, Image, DevSettings } from 'react-native';
import moment from 'moment';
import AppStyle from '../style/AppStyle';
import StyleApp from '../style/NewAppStyle';

export const DriveListItem = ({ drive, isNotSameMonth, onPress ,removeCounter}) => {

    const driveImage = (drive.image || drive.image_url) ? { uri: drive.image || drive.image_url } : require('../assets/images/app_icon.png');

    const date = drive.date || drive.time;
    return (<View>
        {isNotSameMonth &&
            <View style={{ backgroundColor: '#000000', alignSelf: 'flex-start', marginVertical: 10 }}>
                <Text style={[AppStyle.semiBoldFamily, AppStyle.text10, AppStyle.whiteColor, { textAlign: 'center', backgroundColor: AppStyle.cyanColor.color, textTransform: 'uppercase', paddingHorizontal: 5 }]}>{moment(date).format('MMMM')}</Text>
            </View>
        }
        <TouchableOpacity style={[{ marginTop: 10,marginLeft:2, width: '100%', }]} onPress={onPress}>
            <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, marginRight: 10 }, AppStyle.boxWithShadow]}>
                <Image source={driveImage} style={[{ width: 80, height: '100%',minHeight:80, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }]} />
                <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
                    <Text style={[StyleApp.semiBoldFont, AppStyle.blackColor, AppStyle.text14, { marginVertical: 2, flexWrap: 'wrap', width: '90%' }]}>{drive.name}</Text>
                    <Text style={[StyleApp.mediumFont, AppStyle.text10, { flexWrap: 'wrap', width: '80%',color:"#24253D" }]} numberOfLines={2} ellipsizeMode='tail'>{drive.description}</Text>
                    <Text style={[StyleApp.boldFont, AppStyle.text10, StyleApp.pramaryColor, { marginVertical: 10 }]}>{moment(date).format('DD MMMM YYYY')}</Text>
                </View>
                {  (drive.hasOwnProperty('count_serve') && !removeCounter)  &&
                    <View style={[{ position: "absolute", right: -5, borderRadius: 20, padding: 10 }, AppStyle.primaryBackgroundColor]}>
                        <Text style={[AppStyle.whiteColor, AppStyle.boldFamily, { fontSize: 11, lineHeight: 12, textAlign: 'center' }]}>{drive.count_serve}</Text>
                        <Text style={[AppStyle.whiteColor, AppStyle.boldFamily, { fontSize: 7, width: '100%', lineHeight: 10 }]}>{drive.hasOwnProperty('image') ? "Joined" : "Served"}</Text>
                    </View>
                }
            </View>
        </TouchableOpacity>
    </View>);
}




{/* <View style={[{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 5, marginRight: 10 }, AppStyle.boxWithShadow]}>
<Image source={driveImage} style={[{ width: 80, height: 80, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }]} />
<View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
    <Text style={[AppStyle.semiBoldFamily, AppStyle.blackColor, AppStyle.text14, { marginVertical: 2, flexWrap: 'wrap', width: '90%' }]}>{drive.name}</Text>
    <Text style={[AppStyle.regularFont, AppStyle.text10, { flexWrap: 'wrap', width: '80%' }]}>{drive.description}</Text>
    <Text style={[AppStyle.semiBoldFamily, AppStyle.text10, AppStyle.cyanColor, { marginVertical: 10 }]}>{moment(date).format('DD MMMM YYYY')}</Text>
</View>
{drive.count_serve &&
    <View style={[{ position: "absolute", right: -10, borderRadius: 20, padding: 10 }, AppStyle.primaryBackgroundColor]}>
        <Text style={[AppStyle.whiteColor, AppStyle.semiBoldFamily, { fontSize: 7, lineHeight: 10, textAlign: 'center' }]}>{drive.count_serve}</Text>
        <Text style={[AppStyle.whiteColor, AppStyle.semiBoldFamily, { fontSize: 7, width: '100%', lineHeight: 10 }]}>{drive.hasOwnProperty('image') ? "Joined" : "Served"}</Text>
    </View>
}
</View> */}