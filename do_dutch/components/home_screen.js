import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon, Button, Container, Header, Content, Left } from "native-base";

import BottomNavigation, {
  FullTab
} from 'react-native-material-bottom-navigation'

export default class HomeScreen extends Component {

  tabs = [
    {
      key: 'games',
      // icon: 'gamepad-variant',
      label: 'Games',
      barColor: '#388E3C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'movies-tv',
      // icon: 'movie',
      label: 'Movies & TV',
      barColor: '#B71C1C',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    },
    {
      key: 'music',
      // icon: 'music-note',
      label: 'Music',
      barColor: '#E64A19',
      pressColor: 'rgba(255, 255, 255, 0.16)'
    }
  ]

  renderIcon = icon => ({ isActive }) => (
    <Icon size={24} color="white" name={icon} />
  )

  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      renderIcon={this.renderIcon(tab.icon)}
    />
  )

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate("Camera")}
          >
            <Text style={styles.text}>Create a New Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate("Form")}
          >
            <Text style={styles.text}>Check Form</Text>
          </TouchableOpacity>
        </View>
        <BottomNavigation
          onTabPress={newTab => this.setState({ activeTab: newTab.key })}
          renderTab={this.renderTab}
          tabs={this.tabs}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#ffffff"
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
    // justifyContent: "flex-end",
    // alignItems: "center"
  }
});
