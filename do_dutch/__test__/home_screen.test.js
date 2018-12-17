import 'jsdom-global/register';
import React from 'react';
import * as enzyme from 'enzyme';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Adapter from 'enzyme-adapter-react-16';

import HomeScreen from '../components/home_screen';
// import { View, StyleSheet, ScrollView } from "react-native";

enzyme.configure({ adapter: new Adapter() });

describe('Checking the rendering of the HomeScreen', () => {

    it('A parent container should be rendered', () => {
        const wrapper = shallow(<HomeScreen />)
        expect(wrapper.find('Component.Container')).toHaveLength(1)
    })
})

describe('Checking the rendering of the container', () => {

    it('A SearchBar should be rendered', () => {
        const wrapper = shallow(<HomeScreen />)
        expect(wrapper.find('Search')).toHaveLength(1)
    })

    it('A ScrollableView should be rendered', () => {
        const wrapper = shallow(<HomeScreen />)
        expect(wrapper.find('ScrollView')).toHaveLength(1);
    })

    it('A View.Modal should be rendered', () => {
        const wrapper = shallow(<HomeScreen />)
        expect(wrapper.find('Component.Modal')).toHaveLength(1);
    })

})
