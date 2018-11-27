import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import { StackNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation";

import GroupMain from "./group_main.js";
import GroupCreate from "./group_create.js";

export default class GroupContainer extends Component {
  constructor() {
    super();
  }

  render() {
    return <GroupStackNavigator />;
  }
}

const GroupStackNavigator = createStackNavigator({
  GroupMain: {
    screen: GroupMain,
    navigationOptions: ({ navigation }) => ({
      title: "Groups",
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
  GroupCreate: {
    screen: GroupCreate,
    navigationOptions: ({ navigation }) => ({
      title: "Create new group",
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
