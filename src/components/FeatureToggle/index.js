import React, { PropTypes } from 'react';
import FeatureToggleService from 'feature-toggle-service';

const featureToggleService = new FeatureToggleService();

const FeatureToggle = (props) => {
  const toggleState = featureToggleService.isOn(props.featureName);
  const showContent = toggleState === !props.showWhenDisabled;
  return (showContent ? props.children : null);
};

FeatureToggle.propTypes = {
  featureName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  showWhenDisabled: PropTypes.bool,
};

export default FeatureToggle;
