/**
 * @overview    Serial IO interface tests
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-26 12:21:37
 * @license     MIT License
 */

'use strict'

const IOInterface = require('../../lib/types/io-interface')
const serialInterface = require('../../lib/samples/serial-io-interface')

describe(`Serial IO interface`, () => {
	it(`is a valid type`, () => {
		expect(IOInterface.validate(serialInterface)).toBe(true)
	})

	it(`can open`, async () => {
		await expect(serialInterface.open()).resolves.toBe()
	})

	it(`can write`, async () => {
		await expect(serialInterface.write(Buffer.from(`test`))).resolves.toBe()
	})

	it(`can set options`, () => {
		expect(serialInterface.setOptions({})).toBe()
	})

	it(`can close`, async () => {
		await expect(serialInterface.close()).resolves.toBe()
	})
})
