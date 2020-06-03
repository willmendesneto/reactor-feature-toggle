// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { ReactNode, FC, ReactElement } from 'react';
import { isOn } from 'feature-toggle-service';

export interface FeatureToggleProps {
  children?: ReactNode;
  featureName: string;
  showWhenDisabled?: boolean;
}

export const FeatureToggle: FC<FeatureToggleProps> = (
  props
): ReactElement<any> | null => {
  const toggleState = isOn(props.featureName);
  const showContent = toggleState === !props.showWhenDisabled;

  return showContent ? (props.children as ReactElement<any>) : null;
};
