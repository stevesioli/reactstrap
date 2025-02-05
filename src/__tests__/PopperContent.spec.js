import React from 'react';
import { shallow, mount } from 'enzyme';
import { Popper } from 'react-popper';
import { PopperContent } from '../';

describe('PopperContent', () => {
  let element;
  let container;

  beforeEach(() => {
    element = document.createElement('div');
    container = document.createElement('div');
    element.innerHTML = '<p id="outerTarget">This is the popover <span id="target">target</span>.</p>';
    container.setAttribute('id', 'container');
    element.appendChild(container);
    document.body.appendChild(element);

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    document.body.removeChild(element);
    element = null;
  });

  it('should render a null by default', () => {
    const wrapper = shallow(<PopperContent target="target">Yo!</PopperContent>);

    expect(wrapper.type()).toBe(null);
  });

  it('should NOT render children when isOpen is false', () => {
    const wrapper = shallow(<PopperContent target="target">Yo!</PopperContent>);

    expect(wrapper.type()).toBe(null);
  });

  it('should render children when isOpen is true and container is inline', () => {
    const wrapper = mount(<PopperContent target="target" isOpen container="inline">Yo!</PopperContent>);

    expect(wrapper.text()).toBe('Yo!');
  });

  it('should render children when isOpen is true and container is inline and DOM node passed directly for target', () => {
    const targetElement = element.querySelector('#target');
    
    const wrapper = mount(<PopperContent target={targetElement} isOpen container="inline">Yo!</PopperContent>);
    expect(targetElement).toBeDefined();
    expect(wrapper.text()).toBe('Yo!');
  });

  it('should render an Arrow in the Popper when isOpen is true and container is inline', () => {
    const wrapper = mount(<PopperContent target="target" isOpen container="inline" arrowClassName="custom-arrow">Yo!</PopperContent>);

    expect(wrapper.containsMatchingElement(<span className="arrow custom-arrow"  />)).toBe(true);
  });

  it('should NOT render an Arrow in the Popper when "hideArrow" is truthy', () => {
    const wrapper = mount(<PopperContent target="target" isOpen container="inline" arrowClassName="custom-arrow" hideArrow>Yo!</PopperContent>);

    expect(wrapper.containsMatchingElement(<span className="arrow custom-arrow" />)).toBe(false);
  });

  it('should render with "hideArrow" false by default', () => {
    const wrapper = mount(<PopperContent target="target">Yo!</PopperContent>);

    expect(wrapper.prop('hideArrow')).toBe(false);
  });

  it('should render with "hideArrow" true when "hideArrow" prop is truthy', () => {
    const wrapper = mount(<PopperContent target="target" hideArrow>Yo!</PopperContent>);

    expect(wrapper.prop('hideArrow')).toBe(true);
  });

  it('should not render children', () => {
    const wrapper = shallow(<PopperContent target="target">Yo!</PopperContent>);

    expect(wrapper.type()).toBe(null);
  });

  it('should pass additional classNames to the popper', () => {
    const wrapper = shallow(<PopperContent className="extra" target="target" isOpen container="inline">Yo!</PopperContent>);

    expect(wrapper.hasClass('extra')).toBe(true);
  });

  it('should allow custom modifiers and even allow overriding of default modifiers', () => {
    const wrapper = mount(
      <PopperContent
        className="extra"
        target="target"
        isOpen
        container="inline"
        modifiers={{
          preventOverflow: { boundariesElement: 'viewport' },
          offset: { offset: 2 },
        }}
      >Yo!</PopperContent>
    );

    expect(wrapper.find(Popper).props().modifiers).toMatchObject({
      // remaining default modifiers
      flip: { enabled: true, behavior: 'flip' },

      // additional modifiers
      preventOverflow: { boundariesElement: 'viewport' },

      // override modifiers
      offset: { offset: 2 },
    });

    wrapper.unmount();
  });

  it('should have x-placement of auto by default', () => {
    const wrapper = mount(<PopperContent target="target" isOpen container="inline">Yo!</PopperContent>);

    console.log(wrapper.debug());

    expect(wrapper.find('div[x-placement="auto"]').exists()).toBe(true);
  });

  it('should override x-placement', () => {
    const wrapper = mount(<PopperContent placement="top" target="target" isOpen container="inline">Yo!</PopperContent>);

    expect(wrapper.find('div[x-placement="auto"]').exists()).toBe(false);
    expect(wrapper.find('div[x-placement="top"]').exists()).toBe(true);
  });

  it('should allow for a placement prefix', () => {
    const wrapper = mount(<PopperContent placementPrefix="dropdown" target="target" isOpen container="inline">Yo!</PopperContent>);

    expect(wrapper.find('.dropdown-auto').exists()).toBe(true);
  });

  it('should allow for a placement prefix with custom placement', () => {
    const wrapper = mount(<PopperContent placementPrefix="dropdown" placement="top" target="target" isOpen container="inline">Yo!</PopperContent>);

    expect(wrapper.find('.dropdown-auto').exists()).toBe(true);
    expect(wrapper.find('div[x-placement="top"]').exists()).toBe(true);
  });

  it('should render custom tag for the popper', () => {
    const wrapper = mount(<PopperContent tag="main" target="target" isOpen container="inline">Yo!</PopperContent>);

    expect(wrapper.getDOMNode().tagName.toLowerCase()).toBe('main');
  });
});
