'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _featureToggleService = require('feature-toggle-service');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FeatureToggle = function FeatureToggle(props) {
  var toggleState = (0, _featureToggleService.isOn)(props.featureName);
  var showContent = toggleState === !props.showWhenDisabled;
  return showContent ? props.children : null;
};

FeatureToggle.propTypes = {
  children: _propTypes.node.isRequired,
  featureName: _propTypes.string.isRequired,
  showWhenDisabled: _propTypes.bool
};

exports.default = FeatureToggle;