/**
 * @overview    Apex 7000 sample
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-28 15:18:50
 * @license     MIT License
 */

'use strict'

const createApex7000 = require('../lib/create-apex-7000')
const serialInterface = require('./serial-io-interface')

const main = async () => {
	const apex7000 = createApex7000({
		ioInterface: serialInterface
	})
	apex7000.onAny((event, value) => {
		console.log({[event]: value})
	})
	await apex7000.start()
	apex7000.accept()
}

main()
