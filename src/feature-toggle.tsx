// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { ReactNode, FC, ReactElement } from 'react';
import { isOn } from 'feature-toggle-service';

export interface FeatureToggleProps {
  children?: ReactNode;
  featureName: string[] | string;
  showWhenDisabled?: boolean;
}

/**
 * Checks if feature toggle is turned on of turned off
 *
 * @param {string} toggle: name of the feature toggle previously configured via `FeatureToggleProvider`
 *
 * @returns boolean
 */

/**
 *
 *
 * @param {(string[] | string)} featureName: : name of the feature toggle previously configured via `FeatureToggleProvider`
 *
 * @returns boolean
 */
const isOnCheck = (featureName: string[] | string) => {
  const isFeatureToggleOn = (toggle: string) =>
    toggle[0] === '!' ? !isOn(toggle.replace('!', '')) : isOn(toggle);

  if (typeof featureName === 'string') {
    return isFeatureToggleOn(featureName as string);
  } else if (Array.isArray(featureName)) {
    return (featureName as string[]).every(isFeatureToggleOn);
  }

  return false;
};

export const FeatureToggle: FC<FeatureToggleProps> = (
  props
): ReactElement<any> | null => {
  const showContent = isOnCheck(props.featureName);

  return showContent ? (props.children as ReactElement) : null;
};
