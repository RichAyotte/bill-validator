/**
 * @overview    Jest config
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-18 10:14:54
 * @license     MIT License
 */

'use strict'

module.exports = {
	coverageDirectory: 'test/coverage'
	, collectCoverageFrom: [
		'index.js'
		, 'lib/**/*.js'
	]
	, verbose: true
}
