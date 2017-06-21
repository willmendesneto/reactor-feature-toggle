import React, { PropTypes } from 'react';
import { isOn } from 'feature-toggle-service';

const FeatureToggle = (props) => {
  const toggleState = isOn(props.featureName);
  const showContent = toggleState === !props.showWhenDisabled;
  return (showContent ? props.children : null);
};

FeatureToggle.propTypes = {
  featureName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  showWhenDisabled: PropTypes.bool,
};

export default FeatureToggle;
