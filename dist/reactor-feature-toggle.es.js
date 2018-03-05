import 'react';
import { string, node, bool, objectOf } from 'prop-types';
import { isOn, setConfigurationObject } from 'feature-toggle-service';

var FeatureToggle = function FeatureToggle(props) {
  var toggleState = isOn(props.featureName);
  var showContent = toggleState === !props.showWhenDisabled;
  return showContent ? props.children : null;
};

FeatureToggle.propTypes = {
  children: node.isRequired,
  featureName: string.isRequired,
  showWhenDisabled: bool
};

var FeatureToggleProvider = function FeatureToggleProvider(props) {
  setConfigurationObject(props.featureToggleService);
  return props.children;
};

FeatureToggleProvider.propTypes = {
  children: node.isRequired,
  featureToggleService: objectOf(bool)
};

var index = { FeatureToggleProvider: FeatureToggleProvider, FeatureToggle: FeatureToggle };

export default index;
export { FeatureToggleProvider, FeatureToggle };
