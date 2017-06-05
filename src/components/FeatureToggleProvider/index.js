import React, { PropTypes } from 'react';
import FeatureToggleService from 'feature-toggle-service';

const FeatureToggleProvider = (props) => {
  const featureToggleService = new FeatureToggleService();
  featureToggleService.setConfigurationObject(
    props.featureToggleService
  );
  return props.children;
};

FeatureToggleProvider.propTypes = {
  featureToggleService: PropTypes.objectOf(PropTypes.bool),
  children: PropTypes.node.isRequired,
};

export default FeatureToggleProvider;
