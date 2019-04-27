/**
 * @overview    Apex 7000 tests
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-20 12:06:27
 * @license     MIT License
 */

'use strict'

const BillValidator = require('../../lib/types/bill-validator')
const createApex7000 = require('../../lib/create-apex-7000')
const serialInterface = require('../../samples/serial-io-interface')

describe('Apex 7000 bill validator', () => {
	const apex7000 = createApex7000({
		ioInterface: serialInterface
	})

	it('is a valid model', () => {
		expect(BillValidator.validate(apex7000)).toBe(true)
	})

	it('can start', async () => {
		await expect(apex7000.start()).resolves.toBe()
	})

	it('can accept', () => {
		apex7000.accept()
	})

	it('can idle', () => {
		apex7000.idle()
	})

	it('can stop', async () => {
		await expect(apex7000.stop()).resolves.toBe()
	})
})
