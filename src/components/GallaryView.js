import React, { Component } from 'react';
import { View, Modal, } from 'react-native';
import Gallery from 'react-native-image-gallery';



export default class GalleryView extends Component {

    render() {
        console.log(this.props.showModal);
        const showModal = this.props.showModal !== false ? true : false;
        const pageNumber = this.props.showModal ? this.props.showModal : 0;
        return (
            <View style={{ alignItems: 'center', flex: 1 }}>

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={showModal}
                    onRequestClose={() => { this.props.onClose() }}  >
                    <Gallery
                        initialPage={pageNumber}
                        style={{ flex: 1, backgroundColor: 'black' }}
                        images={this.props.images.map((i) => {
                            return { source: { uri: i.image_url } };
                        })}
                    />
                </Modal></View>)
    }
}