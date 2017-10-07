// @flow
import React from 'react';
import { isOn } from 'feature-toggle-service';

// Type aliases
type FeatureToggleProps = {
  featureName: string,
  children?: React.Node,
  showWhenDisabled: boolean,
};

const FeatureToggle = (props: FeatureToggleProps) => {
  const toggleState: boolean = isOn(props.featureName);
  const showContent: boolean = toggleState === !props.showWhenDisabled;
  return (showContent ? props.children : null);
};

export default FeatureToggle;
