import React from 'react';
import { mount } from 'enzyme';
import { FeatureToggleProvider } from '../../feature-toggle-provider';
import { FeatureToggle } from '../../feature-toggle';
import { FeatureToggleServiceConfig } from 'feature-toggle-service';

describe('<FeatureTogglesProvider />', () => {
  let featureToggleProvider: any;
  const featureToggleService: FeatureToggleServiceConfig = {
    thisOneIsEnabled: true,
    thisOneIsDisabled: false,
  };

  beforeEach(() => {
    featureToggleProvider = mount(
      <FeatureToggleProvider featureToggleService={featureToggleService}>
        <div>
          <FeatureToggle featureName={'thisOneIsEnabled'}>
            <div className="content">
              <p>Enabled content</p>
              <FeatureToggle featureName={'!thisOneIsDisable'}>
                <p>Another enabled content</p>
              </FeatureToggle>

              <FeatureToggle featureName={'thisOneIsDisable'}>
                <p>Disabled content</p>
              </FeatureToggle>
              <FeatureToggle featureName={'!thisOneIsEnabled'}>
                <p>Another Disabled content</p>
              </FeatureToggle>
            </div>
          </FeatureToggle>
        </div>
      </FeatureToggleProvider>
    );
  });

  it('should render the enabled children content', () => {
    expect(featureToggleProvider.text()).toContain('Enabled content');
    expect(featureToggleProvider.text()).toContain('Another enabled content');
  });

  it('should NOT render the disabled content', () => {
    expect(featureToggleProvider.text()).not.toContain('Disabled content');
    expect(featureToggleProvider.text()).not.toContain(
      'Another disabled content'
    );
  });
});
