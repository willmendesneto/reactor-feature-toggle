// @flow
import React from 'react';
import { isOn } from 'feature-toggle-service';

// Type aliases
type FeatureToggleProps = {
  featureName: string,
  children: any,
  showWhenDisabled: boolean,
};

const FeatureToggle = (props: FeatureToggleProps) => {
  const toggleState = isOn(props.featureName);
  const showContent = toggleState === !props.showWhenDisabled;
  return (showContent ? props.children : null);
};

export default FeatureToggle;
