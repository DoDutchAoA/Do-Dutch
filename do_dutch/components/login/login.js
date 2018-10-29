import React, { Component } from 'react';
import { AppRegistry, Image } from 'react-native'; 
import {Platform, StyleSheet, Text, View, TextInput} from 'react-native'; 
import { Button } from 'react-native-elements'; 

export default class LogIn extends Component { 

	userLogin() {
	    RNFetchBlob.fetch('POST', 'http://www.example.com/upload-form', {
	      'Content-Type' : 'application/json',
	    }, [
	    { 
	        username: this.state.username, 
	        password: this.state.password
	    },
	    ]).then((resp) => {

	    }).catch((err) => {

	    })
	}

  	render() { 
	    this.state = {
	      	username: "", 
	      	password: "" 
    }; 

    return ( 
    	<View> 
    		<Text> Log In </Text> 
          <TextInput 
            placeholder='Username' 
            autoFocus={true} 
            keyboardType='email-address' 
            onChangeText={(text) => this.setState({username: text})} /> 

          <TextInput 
            placeholder='password' 
            secureTextEntry={true} 
            onChangeText={(text) => this.setState({password: text})} /> 

          <Button onPress={(e) => this.userLogIn(e)} title='login'/> 
    	</View> 
    );
  }
} 

