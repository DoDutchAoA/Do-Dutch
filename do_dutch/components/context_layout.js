import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import Camera from "./receipt_actions/camera.js";
import Form from "./receipt_actions/fetch.js";
import ReceiptScreen from "./receipt_actions/receipt_screen.js";
import HomeScreen from "./home_screen.js";
import { StyleSheet, Text } from "react-native";

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
      headerTitle: (
        <Text
          style={{
            fontFamily: "sans-serif-condensed",
            textAlign: "center",
            width: "100%",
            fontSize: 24
          }}
        >
          G o &nbsp;&nbsp; D u t c h
        </Text>
      )
    })
  },
  Camera: {
    screen: Camera,
    navigationOptions: ({ navigation }) => ({
      title: "New Receipt",
      headerTitleStyle: {
        color: "#17202a",
        textAlign: "center",
        fontFamily: "Copperplate-Bold"
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
