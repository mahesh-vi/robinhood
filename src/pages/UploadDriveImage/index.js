import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';

import AppStyle from '../../style/AppStyle';
import Loader from '../../components/Loader';
import ImagePicker from 'react-native-image-crop-picker';

import StyleApp from '../../style/NewAppStyle'
import DriveService from '../../services/DriveService';

export default class UploadDriveImage extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            album_images: []
        };

        this.getImage = this.getImage.bind(this);
        console.log(this.props.navigation.getParam('drive', null))
    }


    /**
     * @name getImage
     * @description get drive image from device
     */
    getImage() {
        const _this = this;

        ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo'
        }).then(images => {
            console.log(images);
            let album_images = [..._this.state.album_images, ...images];
            _this.setState({
                album_images: album_images,
                error:undefined
            });
        });
    }

    /**
     * @name removeImage
     * @description image image that select to upload in drive
     */
    removeImage(index) {
        var { album_images } = this.state;
        album_images.splice(index, 1);
        this.setState({ album_images: album_images });
    }

    /**
      * @name upload
      * @description upload selected image to server
      */
    upload() {
        const {album_images} = this.state;
       const driveData =  this.props.navigation.getParam('drive', null);
       const { id ,drive_id} =driveData;

        if(album_images.length>0){
            this.setState({loading:true});
            DriveService.uploadImageInDrive(id || drive_id, album_images).then((res) => {
                this.setState({ loading: false });
                this.props.screenProps.eventEmitter.emit('DriveUpdate', {count:1});
                this.props.screenProps.alert({
                    title: 'Robinhood',
                    body: 'Image uploaded into drive.',
                });
                this.props.navigation.goBack();
            }).catch((error) => {
                console.log(error);
                this.setState({ loading: false });
                CommonUtil.errorMessage(error,this.props);
            });
        }else{
            this.setState({error:'Select atleast one image for upload'})
        }
    }


    render() {
        return (
            <ScrollView style={styles.mainContainer}>
                <Loader loading={this.state.loading} />
                <View style={{ marginHorizontal: 20 }}>


                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <Ionicons name={'ios-arrow-round-back'} size={40} onPress={() => this.props.navigation.goBack()} />
                        <View style={{ marginLeft: 20 }}>
                            <Text style={[StyleApp.headerText]}>{`Upload Drive's Image`}</Text>
                            <Text style={[StyleApp.headerSubText]}>{'Upload drive images here'}</Text>
                        </View>
                    </View>

                    <FlatList
                        data={this.state.album_images}
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                                <TouchableOpacity
                                    key={index}
                                    style={{ flex: 1 }}
                                >
                                    <Image style={styles.image}
                                        source={{
                                            uri: item.path,
                                        }}
                                    />
                                    <FeatherIcon name={'x-circle'} size={30} style={{ color: 'rgba(255,10,10,0.5)', position: 'absolute', right: 0 }} onPress={() => this.removeImage(index)} />
                                </TouchableOpacity>
                            </View>
                        )}
                        //Setting the number of column
                        numColumns={2}
                        keyExtractor={(item, index) => index.toString()}
                    />

                    <TouchableOpacity style={{ marginVertical: 5 }} onPress={this.getImage}>
                        <View style={{ flex: 1, alignItems: 'center', padding: 20, justifyContent: 'center' }}>
                            <Image source={require(`../../assets/images/image_upload.png`)} style={{ marginVertical: 10 }} />

                            <Text style={[AppStyle.text12, { textAlign: 'center', flexWrap: 'wrap' }]}>Upload Photos of the revent drive which reflects food distribution.</Text>
                        </View>
                    </TouchableOpacity>
                    {this.state.error && <Text style={[AppStyle.errorText]}> {this.state.error}</Text>}



                    <TouchableOpacity style={[{ marginTop: 20, height: 44, paddingHorizontal: 30, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, AppStyle.primaryBackgroundColor]}
                        onPress={() => { this.upload() }}>
                        <Text style={{ color: '#fff', textTransform: 'uppercase', fontFamily: 'Montserrat-Bold' }}>Upload</Text>
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
    },

    image: {
        height: 120,
        width: '100%',
    },
});
