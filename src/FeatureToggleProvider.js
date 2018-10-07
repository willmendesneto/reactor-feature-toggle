import React from 'react';
import { objectOf, node, bool } from 'prop-types';
import { set } from 'feature-toggle-service';

const FeatureToggleProvider = props => {
  set(props.featureToggleService);
  return props.children;
};

FeatureToggleProvider.propTypes = {
  children: node.isRequired,
  featureToggleService: objectOf(bool),
};

export default FeatureToggleProvider;
