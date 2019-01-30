/**
 * @overview    Serial IO interface
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-22 13:38:30
 * @license     MIT License
 */

'use strict'

const {promisify} = require('util')

const ByteLength = require('@serialport/parser-byte-length')
const SerialPort = require('serialport')

const IOInterface = require('./types/io-interface')
const CreateSerialInterfaceFunction = require('./types/create-serial-interface')

module.exports = CreateSerialInterfaceFunction(options => {
	let parser = null

	const port = new SerialPort(
		options.port
		, options.portOptions
	)

	/**
	 * Promisify some port methods to satisfy IOInterface interface.
	 */
	const openPort = promisify(port.open.bind(port))
	const closePort = promisify(port.close.bind(port))
	const writePort = promisify(port.write.bind(port))
	const drainPort = promisify(port.drain.bind(port))

	const serialPortInterface = IOInterface({
		async close() {
			return closePort()
		}
		, async open() {
			if (parser === null) {
				console.log('WARNING: Parser is null. Did you set the rxMessageLength?')
			}
			return openPort()
		}
		, setOptions({rxMessageLength}) {
			if (rxMessageLength) {
				parser = port.pipe(new ByteLength({
					length: rxMessageLength
				}))

				parser.on('data', data => {
					serialPortInterface.emit('data', data)
				})
			}
		}
		, async write(data) {
			await writePort(data)
			return drainPort()
		}
	})

	// Bubble up errors
	port.on('error', error => {
		serialPortInterface.emit('error', error)
	})

	// Close port on ctrl-c
	port.on('open', () => {
		process.once('SIGUSR2', () => {
			const die = () => process.kill(process.pid, 'SIGUSR2')
			port.close(die)
		})
	})

	return serialPortInterface
})
