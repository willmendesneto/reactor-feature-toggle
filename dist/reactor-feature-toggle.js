(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define(['react', 'prop-types'], factory) :
	(global.ReactorFeatureToggle = factory(global.React,global.PropTypes));
}(this, (function (react,propTypes) { 'use strict';

	react = react && react.hasOwnProperty('default') ? react['default'] : react;

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var featureToggleService = createCommonjsModule(function (module, exports) {
	    /*!
	     * feature-toggle-service.js v3.0.0
	     * https://willmendesneto.github.io/feature-toggle-service.js
	     *
	     * Licensed MIT © Will Mendes
	     */
	    (function (global, factory) {
	        if (typeof undefined === "function" && undefined.amd) {
	            undefined("FeatureToggleService", ["exports"], factory);
	        } else {
	            factory(exports);
	        }
	    })(commonjsGlobal, function (exports) {

	        Object.defineProperty(exports, "__esModule", { value: true });
	        var settings = {};
	        var isOn = function isOn(key) {
	            return !!settings[key];
	        };
	        exports.isOn = isOn;
	        var setConfigurationObject = function setConfigurationObject(obj) {
	            settings = obj;
	        };
	        exports.setConfigurationObject = setConfigurationObject;
	    });
	});

	unwrapExports(featureToggleService);
	var featureToggleService_1 = featureToggleService.isOn;
	var featureToggleService_2 = featureToggleService.setConfigurationObject;

	var FeatureToggle = function FeatureToggle(props) {
	  var toggleState = featureToggleService_1(props.featureName);
	  var showContent = toggleState === !props.showWhenDisabled;
	  return showContent ? props.children : null;
	};

	FeatureToggle.propTypes = {
	  children: propTypes.node.isRequired,
	  featureName: propTypes.string.isRequired,
	  showWhenDisabled: propTypes.bool
	};

	var FeatureToggleProvider = function FeatureToggleProvider(props) {
	  featureToggleService_2(props.featureToggleService);
	  return props.children;
	};

	FeatureToggleProvider.propTypes = {
	  children: propTypes.node.isRequired,
	  featureToggleService: propTypes.objectOf(propTypes.bool)
	};

	// This file exists as an entry point for bundling our umd builds.

	var index_umd = { FeatureToggleProvider: FeatureToggleProvider, FeatureToggle: FeatureToggle };

	return index_umd;

})));
