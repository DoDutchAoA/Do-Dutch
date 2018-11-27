import React, { Component } from "react";
import { AppRegistry, Image } from "react-native";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Button, Container, Header, Content, Left } from "native-base";
import { StackNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import HeaderButtons, {
  HeaderButton,
  Item
} from "react-navigation-header-buttons";
import { NavigationActions } from "react-navigation";

import { createStackNavigator } from "react-navigation";
import Camera from "./receipt_actions/camera.js";
import Form from "./receipt_actions/fetch.js";
import ReceiptScreen from "./receipt_actions/receipt_screen.js";
import HomeScreen from "./home_screen.js";

export default class ContextLayout extends Component {
  render() {
    this.state = {
      context_route: "home"
    };

    return <AppStackNavigator />;
  }
}

const AppStackNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Home",
      headerTitleStyle: {
        color: "#17202a",
        textAlign: "center",
        fontFamily: "Montserrat-Regular"
      },
      headerStyle: {
        backgroundColor: "#d5d8dc",
        textAlign: "center"
      }
    })
  },
  Camera: {
    screen: Camera,
    navigationOptions: ({ navigation }) => ({
      title: "Creat New Receipt",
      headerTitleStyle: {
        color: "#17202a",
        textAlign: "center",
        fontFamily: "Montserrat-Regular"
      },
      headerStyle: {
        backgroundColor: "#d5d8dc",
        textAlign: "center"
      }
      // headerLeft: (
      //     <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
      //         <Item title="select" iconName="bars" onPress={() => {alert(navigation.navigate); navigation.dispatch('Form')}} />
      //     </HeaderButtons>
      // )
    })
  },
  Form: {
    screen: Form,
    navigationOptions: ({ navigation }) => ({
      title: "Receipt",
      headerTitleStyle: {
        color: "#17202a",
        textAlign: "center",
        fontFamily: "Montserrat-Regular"
      },
      headerStyle: {
        backgroundColor: "#d5d8dc",
        textAlign: "center"
      }
    })
  },
  Receipt: {
    screen: ReceiptScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Receipt",
      headerTitleStyle: {
        color: "#17202a",
        textAlign: "center",
        fontFamily: "Montserrat-Regular"
      },
      headerStyle: {
        backgroundColor: "#d5d8dc",
        textAlign: "center"
      }
    })
  }
});
