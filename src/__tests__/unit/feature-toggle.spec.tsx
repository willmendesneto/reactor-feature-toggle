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
  };

  let featureToggle: any;
  const context = {};

  beforeEach(() => {
    set({
      [featureNames.thisOneIsEnabled]: true,
      [featureNames.thisOneIsDisabled]: false,
    });
  });

  describe('When the given toggle is enabled', () => {
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

    it('should not render wrapping div', () => {
      expect(featureToggle.html()).toEqual(expectedHtmlContent);
    });
  });

  describe('When the given toggle is disabled', () => {
    beforeEach(() => {
      featureToggle = shallow(
        <FeatureToggle featureName={featureNames.thisOneIsDisabled}>
          {aChildComponent}
        </FeatureToggle>,
        { context }
      );
    });

    it('does not render children is toggle with name is not enabled', () => {
      expect(featureToggle.contains(aChildComponent)).toEqual(false);
    });
  });

  describe('When it has `showWhenDisable` flag', () => {
    beforeEach(() => {
      featureToggle = shallow(
        <FeatureToggle
          featureName={featureNames.thisOneIsDisabled}
          showWhenDisabled
        >
          {aChildComponent}
        </FeatureToggle>,
        { context }
      );
    });

    it('should render children if toggle with name is disabled and flag exists', () => {
      expect(featureToggle.contains(aChildComponent)).toEqual(true);
    });

    it('should render wrapping div (or any other tag) - just children', () => {
      expect(featureToggle.html()).toEqual(expectedHtmlContent);
    });

    it('should render children if toggle with name is enabled and flag exists', () => {
      expect(featureToggle.contains(aChildComponent)).toEqual(true);
    });
  });
});
