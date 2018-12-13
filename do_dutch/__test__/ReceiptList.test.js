import 'jsdom-global/register';

import React from 'react';
import * as enzyme from 'enzyme';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Adapter from 'enzyme-adapter-react-16';

import ReceiptList from '../components/receipt/ReceiptList';

import { ReceiptListItem } from '../components/receipt/ReceiptList';

enzyme.configure({ adapter: new Adapter() });

describe('Checking the rendering of ReceiptList', () => {

    it('A divider should be rendered', () => {
        const wrapper = shallow(<ReceiptList />)
        expect(wrapper.find('Divider')).toHaveLength(1)
    })

    it('If no history, a prompt should be rendered', () => {
        const wrapper = shallow(<ReceiptList />);
        wrapper.setState({receiptHistory: null })
        // expect(wrapper.find('Text')).toHaveLength(1)
    })


    it('If no history, a prompt should be rendered', () => {
        const wrapper = shallow( <ReceiptList
            onRef={jest.fn()}
            groupTitle="ONGOING"
            prompt=""
            keyword=""
            onPressRecord={jest.fn()}
            receiptHistory={[]}
          />)

        expect(wrapper.find('.prompt')).toHaveLength(1)
    })
})

describe('Checking the rendering of ReceiptListItem', () => {

    it('A touchableOpacity should be rendered', () => {
        const wrapper = shallow(<ReceiptListItem />)
        expect(wrapper.find('TouchableOpacity')).toHaveLength(1)
    })

    it('Items should be rendered in a correct style', () => {
        const wrapper = shallow(<ReceiptListItem />)
        expect(wrapper.find('.itemOnwerStatus')).toHaveLength(1)

        let containerStyle = wrapper.find('.itemOnwerStatus').get(0).props.style;
        console.log("style", containerStyle)
        expect(containerStyle).toHaveProperty('opacity', '1');
    })
})
