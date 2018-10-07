import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FeatureToggle } from '../../src';
import { set } from 'feature-toggle-service';

describe('<FeatureToggle />', () => {
  const aChildComponent = <div>Yay I am a child</div>;
  const expectedHtmlContent = '<div>Yay I am a child</div>';

  const featureNames = {
    thisOneIsEnabled: 'thisOneIsEnabled',
    thisOneIsDisabled: 'thisOneIsDisabled',
  };

  let featureToggle;
  const context = {};

  before(() => {
    set({
      [featureNames.thisOneIsEnabled]: true,
      [featureNames.thisOneIsDisabled]: false,
    });
  });

  describe('When the given toggle is enabled', () => {
    before(() => {
      featureToggle = shallow(
        <FeatureToggle featureName={featureNames.thisOneIsEnabled}>
          {aChildComponent}
        </FeatureToggle>,
        { context }
      );
    });

    it('should render children', () => {
      expect(featureToggle.contains(aChildComponent)).to.equal(true);
    });

    it('should not render wrapping div', () => {
      expect(featureToggle.html()).to.equal(expectedHtmlContent);
    });
  });

  describe('When the given toggle is disabled', () => {
    before(() => {
      featureToggle = shallow(
        <FeatureToggle featureName={featureNames.thisOneIsDisabled}>
          {aChildComponent}
        </FeatureToggle>,
        { context }
      );
    });

    it('does not render children is toggle with name is not enabled', () => {
      expect(featureToggle.contains(aChildComponent)).to.equal(false);
    });
  });

  describe('When it has `showWhenDisable` flag', () => {
    before(() => {
      featureToggle = shallow(
        <FeatureToggle featureName={featureNames.thisOneIsDisabled} showWhenDisabled>
          {aChildComponent}
        </FeatureToggle>,
        { context }
      );
    });

    it('should render children if toggle with name is disabled and flag exists', () => {
      expect(featureToggle.contains(aChildComponent)).to.equal(true);
    });

    it('should render wrapping div (or any other tag) - just children', () => {
      expect(featureToggle.html()).to.equal(expectedHtmlContent);
    });

    it('should render children if toggle with name is enabled and flag exists', () => {
      expect(featureToggle.contains(aChildComponent)).to.equal(true);
    });
  });
});
