/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";

import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import { Button } from "react-native-elements";

const options = {
  title: "Select a photo",
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
    };
  }

  selectPhoto() {
    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        let source = { uri: response.uri };
        this.setState({
          imageSource: source,
          data: response.data
        });
      }
    });
  }

  UploadPhoto() {
    console.log("uploading..");
    RNFetchBlob.fetch(
      "POST",
      "http://52.12.74.177:5000/upload",
      {
        "Content-Type": "multipart/form-data"
      },
      [
        {
          name: "image",
          filename: window.user_id + "image.png",
          type: "image/png",
          data: this.state.data
        }
      ]
    )
      .then(resp => {
        console.log("upload successfully!");
        console.log(resp);
        console.log("========");
        console.log(JSON.parse(resp.data).items);

        this.props.navigation.navigate("Receipt", {
          receipt_items: JSON.parse(resp.data).items,
          receipt_total: JSON.parse(resp.data).accumTotal
        });
      })
      .catch(err => {
        console.error("Error: " + err);
      });
  }

  render() {
    // if (window.user_id == undefined) {
    //   return (
    //     <View>
    //       <Text> Please log in first. </Text>
    //     </View>
    //   );
    // }

    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={
            this.state.imageSource != null
              ? this.state.imageSource
              : require("./../../images/image-not-available.png")
          }
        />
        <TouchableOpacity
          style={styles.button}
          onPress={this.selectPhoto.bind(this)}
        >
          <Text style={styles.text}>Select</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={this.UploadPhoto.bind(this)}
        >
          <Text style={styles.text}>Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("Receipt")}
        >
          <Text style={styles.text}>Check Form</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: "#330066",
    borderRadius: 30,
    justifyContent: "center",
    marginTop: 15
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center"
  },
  view: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 30
  }
});
