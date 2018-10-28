/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'

const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: "Take a photo",
  chooseFromLibraryButtonTitle: "Choose from gallery",
  quality: 1
};


export default class Camera extends Component {
  constructor() {
    super();
    this.state = {
      imageSource: null,
      data: null
    }
  }

  selectPhoto() {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {
        let source = { uri: response.uri };
        this.setState({
          imageSource: source,
          data: response.data
        });
      }
    });
  }

  UploadPhoto() {
    RNFetchBlob.fetch('POST', 'http://www.example.com/upload-form', {
      Authorization : "Bearer access-token",
      otherHeader : "foo",
      'Content-Type' : 'multipart/form-data',
    }, [
    { name : 'image', filename : 'image.png', type:'image/png', data: this.state.data},
    ]).then((resp) => {

    }).catch((err) => {

    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image}
          source={this.state.imageSource != null ? this.state.imageSource : 
            require('./../images/image-not-available.png')}
        />
        <TouchableOpacity style={styles.button} onPress={this.selectPhoto.bind(this)}>
          <Text style={styles.text}>Select</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.UploadPhoto}>
          <Text style={styles.text}>Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() =>this.props.navigation.navigate("Form")}>
          <Text style={styles.text}>Check Form</Text>
        </TouchableOpacity>
      </View>
      );
  }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: '#330066',
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 15
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center'
  },
  view: {
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 30
  }
});


