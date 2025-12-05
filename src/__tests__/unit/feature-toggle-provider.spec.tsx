import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeatureToggleProvider } from '../../feature-toggle-provider';
import { FeatureToggle } from '../../feature-toggle';
import { FeatureToggleServiceConfig } from 'feature-toggle-service';

describe('<FeatureTogglesProvider />', () => {
  const featureToggleService: FeatureToggleServiceConfig = {
    thisOneIsEnabled: true,
    thisOneIsDisabled: false,
  };

  it('should render the enabled children content', () => {
    render(
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

    expect(screen.getByText('Enabled content')).toBeInTheDocument();
    expect(screen.getByText('Another enabled content')).toBeInTheDocument();
  });

  it('should NOT render the disabled content', () => {
    render(
      <FeatureToggleProvider featureToggleService={featureToggleService}>
        <div>
          <FeatureToggle featureName={'thisOneIsEnabled'}>
            <div className="content">
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

    expect(screen.queryByText('Disabled content')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Another Disabled content')
    ).not.toBeInTheDocument();
  });
});
