/**
 * @overview    Serial interface sample
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-30 10:25:53
 * @license     MIT License
 */

'use strict'

const createSerialInterface = require('../lib/create-serial-interface')

module.exports = createSerialInterface({
	port: '/dev/ttyUSB0'
	, portOptions: {
		autoOpen: false
		, baudRate: 9600
		, dataBits: 7
		, parity: 'even'
		, stopBits: 1
	}
})
