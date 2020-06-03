// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { ReactNode, FC, ReactElement } from 'react';
import { set, FeatureToggleServiceConfig } from 'feature-toggle-service';

export interface FeatureToggleProviderProps {
  children: ReactNode;
  featureToggleService: FeatureToggleServiceConfig;
}

export const FeatureToggleProvider: FC<FeatureToggleProviderProps> = props => {
  set(props.featureToggleService);

  return props.children as ReactElement<any>;
};
