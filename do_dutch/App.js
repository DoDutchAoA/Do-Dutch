/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import { Footer, FooterTab, Button, Icon } from "native-base";
import { TabNavigator } from "react-navigation";

import ContextLayout from "./components/context_layout.js";
import FriendContainer from "./components/friend/friend_container.js";
import GroupContainer from "./components/group/group_container.js";
import LoginContainer from "./components/login_container.js";

const App = TabNavigator(
  {
    ContextLayout: { screen: ContextLayout },
    FriendContainer: { screen: FriendContainer },
    GroupContainer: { screen: GroupContainer },
    LoginContainer: { screen: LoginContainer }
  },
  {
    initialRouteName: "LoginContainer"
  },
  {
    tabBarPosition: "bottom",
    tabBarComponent: props => {
      return (
        <Footer>
          <FooterTab style={{ backgroundColor: "#F0F3F4" }}>
            <Button
              vertical
              active={props.navigationState.index === 0}
              onPress={() => props.navigation.navigate("ContextLayout")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>

            <Button
              vertical
              active={props.navigationState.index === 1}
              onPress={() => {
                props.navigation.navigate("FriendContainer", {
                  user_id: window.user_id
                });
              }}
            >
              <Icon name="people" />
              <Text>Friend</Text>
            </Button>

            <Button
              vertical
              active={props.navigationState.index === 1}
              onPress={() =>
                props.navigation.navigate("GroupContainer", {
                  user_id: window.user_id
                })
              }
            >
              <Icon name="contacts" />
              <Text>Group</Text>
            </Button>

            <Button
              vertical
              active={props.navigationState.index === 1}
              onPress={() => props.navigation.navigate("LoginContainer")}
            >
              <Icon name="settings" />
              <Text>Setting</Text>
            </Button>
          </FooterTab>
        </Footer>
      );
    }
  }
);

export default App;

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
