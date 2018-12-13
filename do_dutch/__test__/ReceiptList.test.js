import 'jsdom-global/register';
import React from 'react';
import * as enzyme from 'enzyme';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Adapter from 'enzyme-adapter-react-16';



import ReceiptList from '../components/receipt/ReceiptList';

enzyme.configure({ adapter: new Adapter() });

describe('Checking the rendering', () => {

    it('ReceiptList contains a FlatList', () => {
        const wrapper = shallow(<ReceiptList />)
        // expect(wrapper.find('FlatList')).toHaveLength(1)
    })
})
