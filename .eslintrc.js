'use strict'

module.exports = {
	env: {
		browser: false
		, 'jest/globals': true
		, node: true
	}
	, extends: [
		'ayotte'
	]
	, plugins: ['jest']
	, rules: {
		'new-cap': 'off'
		, 'no-prototype-builtins': 'off'
		, 'no-undefined': 'off'
	}
}
