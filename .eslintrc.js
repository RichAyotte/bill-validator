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
	, parserOptions: {
		sourceType: 'module'
	}
	, plugins: ['jest']
	, rules: {
		'new-cap': 'off'
		, 'no-prototype-builtins': 'off'
		, 'no-undefined': 'off'
	}
}
