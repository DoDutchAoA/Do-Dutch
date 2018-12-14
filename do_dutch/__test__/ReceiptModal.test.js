import 'jsdom-global/register';

import React from 'react';
import * as enzyme from 'enzyme';
import { shallow } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

import ReceiptModal from '../components/receipt/ReceiptModal';

enzyme.configure({ adapter: new Adapter() });

describe('Checking the rendering of the modal', () => {

    it('A Modal should be rendered', () => {
        const wrapper = shallow(<ReceiptModal />)
        expect(wrapper.find('ReactNativeModal')).toHaveLength(1)
    })
})

describe('Group list', () => {

    it('When no group, a prompt should be rendered', () => {
        const wrapper = shallow(<ReceiptModal />)
        expect(wrapper.find('#NoGroupPrompt')).toHaveLength(1)
        expect(wrapper.find('#GroupList')).toHaveLength(0)
    })

    it('When at least one group exsit, a grouplist should be rendered', () => {
        const wrapper = shallow(<ReceiptModal />)
        wrapper.setState({ groups: [{ id: 0, numOfMems: 3 }]})
        expect(wrapper.find('#NoGroupPrompt')).toHaveLength(0)
        expect(wrapper.find('#GroupList')).toHaveLength(1)
    })

    it('When a group is selected, a checked icon should be rendered', () => {
        const wrapper = shallow(<ReceiptModal />)

        let group0 = { id: 0, members: [{id: 0, paid: 5}] };

        wrapper.setState({ groups: [group0],
                           selectedGroup: group0})

        expect(wrapper.find('#selected')).toHaveLength(1)
    })

})
