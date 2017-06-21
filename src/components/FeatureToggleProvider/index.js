import React, { PropTypes } from 'react';
import { setConfigurationObject } from 'feature-toggle-service';

const FeatureToggleProvider = (props) => {
  setConfigurationObject(
    props.featureToggleService
  );
  return props.children;
};

FeatureToggleProvider.propTypes = {
  featureToggleService: PropTypes.objectOf(PropTypes.bool),
  children: PropTypes.node.isRequired,
};

export default FeatureToggleProvider;
