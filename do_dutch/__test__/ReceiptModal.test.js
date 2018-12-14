import 'jsdom-global/register';

import React from 'react';
import * as enzyme from 'enzyme';
import { shallow } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

import ReceiptModal from '../components/receipt/ReceiptModal';
import { Title } from '../components/receipt/ReceiptModal';


enzyme.configure({ adapter: new Adapter() });

describe('Checking the rendering of the modal', () => {

    it('A Modal should be rendered', () => {
        const wrapper = shallow(<ReceiptModal />)
        expect(wrapper.find('ReactNativeModal')).toHaveLength(1)
    })

    // it('Title of Modal can be editted when pressed', () => {
    //     const wrapper = shallow(<ReceiptModal />)
    //     expect(wrapper.find('ReactNativeModal')).toHaveLength(1)
    // })
})
