import React from 'react';
import { string, node, bool } from 'prop-types';
import { isOn } from 'feature-toggle-service';

const FeatureToggle = (props) => {
  const toggleState = isOn(props.featureName);
  const showContent = toggleState === !props.showWhenDisabled;
  return (showContent ? props.children : null);
};

FeatureToggle.propTypes = {
  children: node.isRequired,
  featureName: string.isRequired,
  showWhenDisabled: bool,
};

export default FeatureToggle;
