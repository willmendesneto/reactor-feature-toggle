import React from 'react';
import { objectOf, node, bool } from 'prop-types';
import { setConfigurationObject } from 'feature-toggle-service';

const FeatureToggleProvider = (props) => {
  setConfigurationObject(
    props.featureToggleService
  );
  return props.children;
};

FeatureToggleProvider.propTypes = {
  children: node.isRequired,
  featureToggleService: objectOf(bool),
};

export default FeatureToggleProvider;