import React, { Component } from 'react';
import { AppRegistry, Image } from 'react-native';
import {Platform, StyleSheet, Text, View} from 'react-native';

import Camera from './camera.js';
import {createStackNavigator} from 'react-navigation';
import Form from './fetch.js';

export default class ContextLayout extends Component {
  render() {
  	this.state = {
  		context_route: 'home',
  	};

    return (
      <AppStackNavigator />
    );
  }
}

const AppStackNavigator = createStackNavigator({
  Camera: {screen: Camera,
    navigationOptions: ({navigation}) => ({
      title: "Home",
      headerTitleStyle: {color: '#17202a', textAlign:'center',fontFamily:'Montserrat-Regular'},
      headerStyle: {
        backgroundColor:"#d5d8dc",
        textAlign: 'center'
      }
    })
  },
  Form: {screen: Form,
    navigationOptions: ({navigation}) => ({
        title: "Receipt",
        headerTitleStyle: {color: '#17202a', textAlign:'center',fontFamily:'Montserrat-Regular'},
        headerStyle: {
          backgroundColor:"#d5d8dc",
          textAlign: 'center'
        }
      })}
})
