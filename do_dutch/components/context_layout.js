import React, { Component } from 'react';
import { AppRegistry, Image } from 'react-native'; 
import {Platform, StyleSheet, Text, View} from 'react-native'; 


export default class ContextLayout extends Component {
  render() { 
  	this.state = {
  		context_route: 'home', 
  	}; 

    return ( 
    	// let context_module = 
    	<View> 
    		<Text> Main Context </Text> 

    		<Text> put camera button here. </Text>  
    	</View> 
    );
  }
}
