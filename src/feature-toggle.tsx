import { ReactNode, ReactElement } from 'react';
import { isOn } from 'feature-toggle-service';

export interface FeatureToggleProps {
  children?: ReactNode;
  featureName: string[] | string;
  /** Rendered instead of `children` when the check fails */
  fallback?: ReactNode;
}

/**
 * Checks if feature toggle(s) previously configured via `FeatureToggleProvider`
 * or `set()` are on. Prefix a name with `!` to check that it is off.
 *
 * @param {(string[] | string)} featureName: name(s) of the feature toggle(s); all of them must be on
 *
 * @returns boolean
 */
const isOnCheck = (featureName: string[] | string) => {
  const isFeatureToggleOn = (toggle: string) =>
    toggle[0] === '!' ? !isOn(toggle.slice(1)) : isOn(toggle);

  if (typeof featureName === 'string') {
    return isFeatureToggleOn(featureName);
  } else if (Array.isArray(featureName)) {
    return featureName.every(isFeatureToggleOn);
  }

  return false;
};

export const FeatureToggle = ({
  children,
  featureName,
  fallback = null,
}: FeatureToggleProps): ReactElement => (
  <>{isOnCheck(featureName) ? children : fallback}</>
);
