/**
 * @overview    IO interface tests
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-21 12:44:26
 * @license     MIT License
 */

'use strict'

const IOInterface = require('../../lib/types/io-interface')

describe(`IO interface`, () => {
	const ioInterface = IOInterface({
		close: () => Promise.resolve()
		, open: () => Promise.resolve()
		, setOptions() {}
		, write: () => Promise.resolve()
	})

	it(`is a valid type`, () => {
		expect(IOInterface.validate(ioInterface)).toBe(true)
	})

	it(`can open`, async () => {
		await expect(ioInterface.open()).resolves.toBe()
	})

	it(`can write buffer`, async () => {
		await expect(ioInterface.write(Buffer.from(`test`))).resolves.toBe()
	})

	it(`can set options`, () => {
		expect(ioInterface.setOptions({})).toBe()
	})

	it(`can close`, async () => {
		await expect(ioInterface.close()).resolves.toBe()
	})
})
