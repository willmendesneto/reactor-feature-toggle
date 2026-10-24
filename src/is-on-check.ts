/**
 * Feature toggle name, or a list of names that must all be on.
 * Prefix a name with `!` to check that it is off.
 */
export type FeatureName = string[] | string;

/**
 * Checks if feature toggle(s) are on. Prefix a name with `!` to check that it is off.
 *
 * @param {(key: string) => boolean} isOn: `isOn` of the feature toggle service
 * @param {(string[] | string)} featureName: name(s) of the feature toggle(s); all of them must be on
 *
 * @returns boolean
 */
export const isOnCheck = (
  isOn: (key: string) => boolean,
  featureName: FeatureName
): boolean => {
  const isFeatureToggleOn = (toggle: string) =>
    toggle[0] === '!' ? !isOn(toggle.slice(1)) : isOn(toggle);

  if (typeof featureName === 'string') {
    return isFeatureToggleOn(featureName);
  } else if (Array.isArray(featureName)) {
    return featureName.every(isFeatureToggleOn);
  }

  return false;
};
