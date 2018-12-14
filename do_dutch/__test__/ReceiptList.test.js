import 'jsdom-global/register';

import React from 'react';
import * as enzyme from 'enzyme';
import { shallow } from 'enzyme';

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

describe('Checking the functionaliies of ReceiptList', () => {

    it('When keyword.length == 0, no receiptItem would be rendred', () => {
        const wrapper = shallow( <ReceiptList
            onRef={jest.fn()}
            groupTitle="SEARCH RESULT"
            prompt="All Done!"
            keyword={""}
            onPressRecord={jest.fn()}
            receiptHistory={['a', 'b', 'c']}
          />)

          expect(wrapper.find('.Receipt')).toHaveLength(0);
    })
})

describe('Checking the rendering of ReceiptListItem', () => {

    it('A touchableOpacity should be rendered', () => {
        const wrapper = shallow(<ReceiptListItem />)
        expect(wrapper.find('TouchableOpacity')).toHaveLength(1)
    })

    it('When onwer is a sharer, item should be rendered in steelblue', () => {
        const wrapper = shallow(<ReceiptListItem
            onPressRecord={jest.fn()} image_url={""}
            title={""} balance={0.0}
            place={""} time={""}
            status={"Sharer"} items={[]}
            friends={[]} index={0}
        />)

        expect(wrapper.find('.itemOnwerStatus')
            .prop('style'))
            .toHaveProperty('backgroundColor', 'steelblue');

    })
})
