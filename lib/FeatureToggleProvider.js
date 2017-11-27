'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _featureToggleService = require('feature-toggle-service');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FeatureToggleProvider = function FeatureToggleProvider(props) {
  (0, _featureToggleService.setConfigurationObject)(props.featureToggleService);
  return props.children;
};

FeatureToggleProvider.propTypes = {
  children: _propTypes.node.isRequired,
  featureToggleService: (0, _propTypes.objectOf)(_propTypes.bool)
};

exports.default = FeatureToggleProvider;