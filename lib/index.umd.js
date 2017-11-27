'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _FeatureToggle = require('./FeatureToggle');

var _FeatureToggle2 = _interopRequireDefault(_FeatureToggle);

var _FeatureToggleProvider = require('./FeatureToggleProvider');

var _FeatureToggleProvider2 = _interopRequireDefault(_FeatureToggleProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This file exists as an entry point for bundling our umd builds.
// Both in rollup and in webpack, umd builds built from es6 modules are not
// compatible with mixed imports (which exist in index.js)
// This file does away with named imports in favor of a single export default.

exports.default = { FeatureToggleProvider: _FeatureToggleProvider2.default, FeatureToggle: _FeatureToggle2.default };