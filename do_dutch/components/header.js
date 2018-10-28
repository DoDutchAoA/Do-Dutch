import React, { Component } from 'react';
import { AppRegistry, Image } from 'react-native'; 
import {Platform, StyleSheet, Text, View} from 'react-native'; 

import Signup from './login/signup.js'; 
import Login from './login/login.js'; 


export default class Header extends Component { 

	userAuthentication() {
		let type = this.state.auth_type; 
		if (type == 'signup') {
			return <Login />; 
		} else {
			return <Signup />; 
		}
	}

	render() { 
		this.state = {
			auth_type: 'login'
		}; 

	  return ( 
	  	<View> 
    		<Text> Do Dutch </Text> 
    		{this.userAuthentication()} 
    	</View> 
	  );
	}
}

