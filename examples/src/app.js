/* eslint react/prop-types: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import './example.css';

import AppWrapper from './components/AppWrapper';

const featureToggles = require('./data/featureToggles');

ReactDOM.render(
	<div>
  	<AppWrapper featureToggleService={featureToggles} />
	</div>,
	document.getElementById('example')
);
