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
import Group from "./components/group/group.js";
import LoginContainer from "./components/login_container.js";

const App = TabNavigator(
  {
    ContextLayout: { screen: ContextLayout },
    FriendContainer: { screen: FriendContainer },
    Group: { screen: Group },
    LoginContainer: { screen: LoginContainer }
  },
  {
    tabBarPosition: "bottom",
    tabBarComponent: props => {
      return (
        <Footer>
          <FooterTab>
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
                window.user_id = 22;
                props.navigation.navigate("FriendContainer", { user_id: 22 });
              }}
            >
              <Icon name="people" />
              <Text>Friend</Text>
            </Button>

            <Button
              vertical
              active={props.navigationState.index === 1}
              onPress={() => props.navigation.navigate("Group")}
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
