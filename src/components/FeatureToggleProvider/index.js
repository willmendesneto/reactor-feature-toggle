import React from 'react';
import { setConfigurationObject } from 'feature-toggle-service';

// Type aliases
type FeatureToggleProviderProps = {
  featureToggleService: {| [string]: number |} ,
  children: any,
};


const FeatureToggleProvider = (props: FeatureToggleProviderProps) => {
  setConfigurationObject(
    props.featureToggleService
  );
  return props.children;
};

export default FeatureToggleProvider;
