// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { ReactNode, FC, ReactElement } from 'react';
import { set, FeatureToggleServiceConfig } from 'feature-toggle-service';

export interface ReactorFeatureToggleProviderProps {
  children: ReactNode;
  featureToggleService: FeatureToggleServiceConfig;
}

export const FeatureToggleProvider: FC<ReactorFeatureToggleProviderProps> = props => {
  set(props.featureToggleService);

  return props.children as ReactElement<any>;
};
