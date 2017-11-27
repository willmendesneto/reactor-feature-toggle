import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { FeatureToggleProvider, FeatureToggle } from '../../src';

describe('<FeatureTogglesProvider />', () => {

  let featureToggleProvider;
  const featureToggleService = {
    thisOneIsEnabled: true,
    thisOneIsDisabled: false,
  };

  before(() => {
    featureToggleProvider = mount(
      <FeatureToggleProvider featureToggleService={featureToggleService} >
        <div>
          <FeatureToggle featureName={'thisOneIsEnabled'} >
            <div className="content">
              <p>Enabled content</p>
              <FeatureToggle featureName={'thisOneIsDisable'} >
                <p>Disabled content</p>
              </FeatureToggle>
            </div>
          </FeatureToggle>
        </div>
      </FeatureToggleProvider>
    );
  });

  it('should render the enabled children content', () => {
    expect(featureToggleProvider.text()).to.contain('Enabled content');
  });

  it('should NOT render the disabled content', () => {
    expect(featureToggleProvider.text()).to.not.contain('Disabled content');
  });
});
