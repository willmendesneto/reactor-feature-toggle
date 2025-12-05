import React from 'react';
import { render, screen } from '@testing-library/react';
import { FeatureToggle } from '../../feature-toggle';
import { set } from 'feature-toggle-service';

describe('<FeatureToggle />', () => {
  const aChildComponent = <div>Yay I am a child</div>;

  const featureNames = {
    thisOneIsEnabled: 'thisOneIsEnabled',
    thisOneIsDisabled: 'thisOneIsDisabled',
    thisIsAnotherOneEnabled: 'thisIsAnotherOneEnabled',
    thisIsAnotherOneDisabled: 'thisIsAnotherOneDisabled',
  };

  beforeEach(() => {
    set({
      [featureNames.thisOneIsEnabled]: true,
      [featureNames.thisOneIsDisabled]: false,
      [featureNames.thisIsAnotherOneEnabled]: true,
      [featureNames.thisIsAnotherOneDisabled]: false,
    });
  });

  describe('When the given toggle is enabled', () => {
    describe('When receives a string as `featureName` props', () => {
      it.only('should render children', () => {
        render(
          <FeatureToggle featureName={featureNames.thisOneIsEnabled}>
            {aChildComponent}
          </FeatureToggle>
        );
        expect(screen.getByText('Yay I am a child')).toBeInTheDocument();
      });
    });

    describe('When receives an array as `featureName` props', () => {
      it('should render children', () => {
        render(
          <FeatureToggle
            featureName={[
              featureNames.thisOneIsEnabled,
              featureNames.thisIsAnotherOneEnabled,
            ]}
          >
            {aChildComponent}
          </FeatureToggle>
        );
        expect(screen.getByText('Yay I am a child')).toBeInTheDocument();
      });
    });
  });

  describe('When the given toggle is disabled', () => {
    describe('When receives a string as `featureName` props', () => {
      it('should not render children is toggle with name is not enabled', () => {
        render(
          <FeatureToggle featureName={featureNames.thisOneIsDisabled}>
            {aChildComponent}
          </FeatureToggle>
        );
        expect(screen.queryByText('Yay I am a child')).not.toBeInTheDocument();
      });
    });

    describe('When receives an array as `featureName` props', () => {
      it('should not render children is toggle with name is not enabled', () => {
        render(
          <FeatureToggle
            featureName={[
              featureNames.thisOneIsDisabled,
              featureNames.thisIsAnotherOneDisabled,
            ]}
          >
            {aChildComponent}
          </FeatureToggle>
        );
        expect(screen.queryByText('Yay I am a child')).not.toBeInTheDocument();
      });
    });
  });
});
