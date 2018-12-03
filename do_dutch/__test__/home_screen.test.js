// import 'jsdom-global/register';
import React from 'react';
import * as enzyme from 'enzyme';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import ReactSixteenAdapter from 'enzyme-adapter-react-16';

import HomeScreen from '../components/home_screen';
import ActionButtonItem from '../components/home_screen';

enzyme.configure({ adapter: new ReactSixteenAdapter() });

const setup = () => {
    const wrapper = shallow(<HomeScreen />)
    return wrapper
}

describe('Receipt part', () => {
    const wrapper = setup()

    it('Search bar should be rendered', () => { //tag name?
        expect(wrapper.find('Search').exists()).toEqual(true);
    })

    it('Custom list view should be rendered', () => {
        expect(wrapper.find('ReceiptList').exists()).toEqual(true);
    })

    it('Action button should be rendered', () => {
        expect(wrapper.find('ActionButton').exists()).toEqual(true);
    })

    it('3 action buttons should be rendered', () => {   //tag name?
        expect(wrapper.find('ActionButtonItem')).toHaveLength(3);
    })

    it('A func should be called when the ActionButtonItem is pressed', () => {
        const onPressEvent = jest.fn();
        wrapper.find('ActionButtonItem').first().props().onPress();
        expect(onPressEvent.mock.calls.length).toBe(1);
    })

    it('Clicking on refresh a navigation func should be called ', () => {
        expect(renderer.create(<ActionButtonItem buttonColor="#1abc9c" title="Refresh"
        onPress={jest.fn()} />)).toMatchSnapshot();
      });

  })
