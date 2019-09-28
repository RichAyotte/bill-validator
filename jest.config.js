/**
 * @overview    Jest config
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-18 10:14:54
 * @license     MIT License
 */

// Jest doesn't support ESM 🙁
// https://github.com/standard-things/esm/issues/706

module.exports = {
	coverageDirectory: 'test/coverage'
	, collectCoverageFrom: [
		'index.js'
		, 'lib/**/*.js'
	]
	, verbose: true
	, transform: {
		'\\.m?js$': 'esm'
	}
	, transformIgnorePatterns: []
}
