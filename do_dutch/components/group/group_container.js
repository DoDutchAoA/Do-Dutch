import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import { StackNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation";

import GroupMain from "./group_main.js";
import GroupCreate from "./group_create.js";
import GroupDetail from "./group_detail.js";
import GroupAddMembers from "./group_add_members.js";

export default class GroupContainer extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <GroupStackNavigator
        screenProps={this.props.navigation.getParam("user_id", -1)}
      />
    );
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
  },
  GroupDetail: {
    screen: GroupDetail,
    navigationOptions: ({ navigation }) => ({
      title: "Group detail",
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
  GroupAddMembers: {
    screen: GroupAddMembers,
    navigationOptions: ({ navigation }) => ({
      title: "Add members",
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
