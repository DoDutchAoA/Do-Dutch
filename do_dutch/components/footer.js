import React, { Component } from 'react';
import { AppRegistry, Image, Text, FlatList } from 'react-native';

export default class Footer extends Component {
  render() {
    
    return ( 
    	<FlatList horizontal data={[{key: 'Home'}, {key: 'Friend'}, {key: 'Group'}]}
  				renderItem={({item}) => <Text>{item.key}</Text>} />
    );
  }
}

 