const path = require('path');
const { series, rimraf, concurrent } = require('nps-utils');

module.exports = {
	scripts: {
		build: {
			description: 'clean dist directory and run all builds',
			default: series(
				rimraf('dist'),
				rimraf('lib'),
				concurrent.nps('build.rollup', 'build.babel')
			),
			rollup: 'rollup --config',
			babel: 'babel src -d lib',
			standalone: series(
				'cp examples/src/standalone.html examples/dist/standalone.html',
				'lessc examples/src/example.less examples/dist/example.css'
			),
		},
		publish: {
			default: series(
				rimraf('examples/dist'),
				'webpack --progress -p',
				'cp examples/src/.gitignore examples/dist/.gitignore',
				'gh-pages -d examples/dist'
			),
		},
	},
};
