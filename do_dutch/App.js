/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import { DrawerActions } from "react-navigation-drawer";
import { DrawerNavigator } from "react-navigation";
import { Button } from "react-native-elements";

import ContextLayout from "./components/context_layout.js";
import LoginContainer from "./components/login_container.js";
import Footer from "./components/footer.js";
import HomeScreen from "./components/home_screen.js";
import Camera from "./components/receipt_actions/camera.js";
import Form from "./components/receipt_actions/fetch.js";

class App extends Component {
  render() {
    return <MyApp />;
  }
}

export default App;

const MyApp = DrawerNavigator({
  Home: {
    screen: ContextLayout
  },
  Account: {
    screen: LoginContainer
  },
  CreateReceipt: {
    screen: Camera
  },
  CheckAllReceipts: {
    screen: Form
  }
});

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
