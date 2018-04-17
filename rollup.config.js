import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

const name = 'ReactorFeatureToggle';
const path = 'dist/reactor-feature-toggle';
const globals = {
	'prop-types': 'PropTypes',
	'react-dom': 'ReactDOM',
	react: 'React',
};
const external = Object.keys(globals);
const babelOptions = (production) => {
	let result = {
		babelrc: false,
		presets: [['es2015', { modules: false }], 'stage-0', 'react'],
		plugins: ['external-helpers'],
	};
	if (production) {
		result.plugins.push('transform-react-remove-prop-types');
	};
	return result;
};

const defaultCommonjsResolvers = {
  namedExports: {
    './node_modules/feature-toggle-service/lib/feature-toggle-service.js': ['isOn', 'setConfigurationObject'],
  },
};

export default [
	{
		input: 'src/index.js',
		output: {
			file: path + '.es.js',
			format: 'es',
		},
		external: external,
		plugins: [babel(babelOptions(false))],
	},
	{
		input: 'src/index.umd.js',
		output: {
			name: name,
			file: path + '.js',
			format: 'umd',
      globals,
		},
		external: external,
		plugins: [
      commonjs(defaultCommonjsResolvers),
      babel(babelOptions(false)),
      resolve(),
    ],
	},
	{
		input: 'src/index.umd.js',
		output: {
			name: name,
			file: path + '.min.js',
			format: 'umd',
      globals,
		},
		external: external,
		plugins: [
      commonjs(defaultCommonjsResolvers),
      babel(babelOptions(true)),
      resolve(),
      uglify({}, minify),
    ],
	},
];
