import React from 'react';
import { shallow } from 'enzyme';
import { FeatureToggle } from '../../feature-toggle';
import { set } from 'feature-toggle-service';

describe('<FeatureToggle />', () => {
  const aChildComponent = <div>Yay I am a child</div>;
  const expectedHtmlContent = '<div>Yay I am a child</div>';

  const featureNames = {
    thisOneIsEnabled: 'thisOneIsEnabled',
    thisOneIsDisabled: 'thisOneIsDisabled',
    thisIsAnotherOneEnabled: 'thisIsAnotherOneEnabled',
    thisIsAnotherOneDisabled: 'thisIsAnotherOneDisabled',
  };

  let featureToggle: any;
  const context = {};

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
      beforeEach(() => {
        featureToggle = shallow(
          <FeatureToggle featureName={featureNames.thisOneIsEnabled}>
            {aChildComponent}
          </FeatureToggle>,
          { context }
        );
      });

      it('should render children', () => {
        expect(featureToggle.contains(aChildComponent)).toEqual(true);
      });

      it('should render wrapping div', () => {
        expect(featureToggle.html()).toEqual(expectedHtmlContent);
      });
    });

    describe('When receives an array as `featureName` props', () => {
      beforeEach(() => {
        featureToggle = shallow(
          <FeatureToggle
            featureName={[
              featureNames.thisOneIsEnabled,
              featureNames.thisIsAnotherOneEnabled,
            ]}
          >
            {aChildComponent}
          </FeatureToggle>,
          { context }
        );
      });

      it('should render children', () => {
        expect(featureToggle.contains(aChildComponent)).toEqual(true);
      });

      it('should render wrapping div', () => {
        expect(featureToggle.html()).toEqual(expectedHtmlContent);
      });
    });
  });

  describe('When the given toggle is disabled', () => {
    describe('When receives a string as `featureName` props', () => {
      beforeEach(() => {
        featureToggle = shallow(
          <FeatureToggle featureName={featureNames.thisOneIsDisabled}>
            {aChildComponent}
          </FeatureToggle>,
          { context }
        );
      });

      it('should not render children is toggle with name is not enabled', () => {
        expect(featureToggle.contains(aChildComponent)).toEqual(false);
      });
    });

    describe('When receives an array as `featureName` props', () => {
      beforeEach(() => {
        featureToggle = shallow(
          <FeatureToggle
            featureName={[
              featureNames.thisOneIsDisabled,
              featureNames.thisIsAnotherOneDisabled,
            ]}
          >
            {aChildComponent}
          </FeatureToggle>,
          { context }
        );
      });

      it('should not render children is toggle with name is not enabled', () => {
        expect(featureToggle.contains(aChildComponent)).toEqual(false);
      });
    });
  });
});
