/**
 * @overview    APEX 7000 bill validator specification
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-25 13:12:31
 * @license     MIT License
 */

/* eslint-disable key-spacing, no-bitwise */

import flatMap from 'lodash/flatMap.js'
import get from 'lodash/get.js'
import keys from 'lodash/keys.js'
import values from 'lodash/values.js'

const STX = 0x02
const ETX = 0x03

const messageToChecksum = message => {
	let checksum = 0x00
	for (let i = 1; i < message.length - 1; i += 1) {
		checksum ^= message[i]
	}
	return checksum
}

const apex = {
	type: {
		sent:       0b0010000
		, received: 0b0100000
		, reset:    0b1100000
	}
	, length: {
		head: 3
		, sent: 3
		, received: 6
		, tail: 2
	}
	, command: {
		byte0: {
			enableBill1:     0b0000001
			, enableBill2:   0b0000010
			, enableBill5:   0b0000100
			, enableBill10:  0b0001000
			, enableBill20:  0b0010000
			, enableBill50:  0b0100000
			, enableBill100: 0b1000000
		}
		, byte1: {
			reserved:   0b0000001
			, security: 0b0000010
			, orient0:  0b0000100
			, orient1:  0b0001000
			, escrow:   0b0010000
			, stack:    0b0100000
			, return:   0b1000000
		}
		// , byte2: {
		// 	reserved0:   0b0000001
		// 	, reserved1: 0b0000010
		// 	, reserved2: 0b0000100
		// 	, reserved3: 0b0001000
		// 	, reserved4: 0b0010000
		// 	, reserved5: 0b0100000
		// 	, reserved6: 0b1000000
		// }
	}
	, status: {
		byte0: {
			idling:      0b0000001
			, accepting: 0b0000010
			, escrowed:  0b0000100
			, stacking:  0b0001000
			, stacked:   0b0010000
			, returning: 0b0100000
			, returned:  0b1000000
		}
		, byte1: {
			cheated:          0b0000001
			, billRejected:   0b0000010
			, billJammed:     0b0000100
			, stackerFull:    0b0001000
			, stackerPresent: 0b0010000
			// , reserved0:      0b0100000
			// , reserved1:      0b1000000
		}
		, byte2: {
			powerUp:   0b0000001
			, invalid: 0b0000010
			, failure: 0b0000100
			// Bit 3-5 bill value field
			// Canadian configuration.
			, billEscrowed: {
				// none:       0b000
				bill5:    0b001
				, bill10:   0b010
				, bill20:   0b011
				, bill50:   0b100
				, bill100:  0b101
				// , invalid0: 0b110
				// , invalid1: 0b111
			}
			// , reserved3: 0b1000000
		}
		// , byte3: 'reserved'
		// , byte4: 'model'
		// , byte5: 'firmwareRevision'
		, custom: {
			billStackedValue: null
		}
	}
	, commandsToMessage({commands = {}, ack = 0}) {
		const commandType = get(commands, 'type')
		let type = 0
		let billCommands = 0
		let validatorCommand = 0
		let reservedCommand = 0

		if (commandType === 'reset') {
			type = apex.type.reset
			billCommands = 0b1111111
			validatorCommand = 0b1111111
			reservedCommand = 0b1111111
		}
		else {
			type = apex.type.sent
			billCommands = billCommandsToBin(commands.billCommands)
			validatorCommand = validatorCommandToBin(commands.validatorCommand)
			reservedCommand = reservedCommandToBin(commands.reservedCommand)
		}

		const message = [
			STX
			, apex.getMessageLength('sent')
			, type | ack
			, billCommands
			, validatorCommand
			, reservedCommand
			, ETX
		]

		message.push(messageToChecksum(message))
		return Buffer.from(message)
	}
	, getMessageLength(direction) {
		const l = apex.length
		return l.head + l[direction] + l.tail
	}
	, getProperties() {
		return flatMap(
			values(apex.status).filter(byte => typeof byte === 'object')
			, byte => keys(byte)
		)
	}

	/**
	 * Get the message ack value
	 * @param  {Buffer} message to or from validator
	 * @return {Number} 0 or 1
	 */
	, getMessageAck(message) {
		return message[2] & 0b00001111
	}
}

const billCommandsToBin = commands => {
	if (commands === 'reset') {
		return 0b1111111
	}

	if (Array.isArray(commands)) {
		return commands.reduce(
			(byte0, command) => byte0 | apex.command.byte0[command]
			, 0
		)
	}

	return 0
}

const validatorCommandToBin = command => {
	if (command === 'reset') {
		return 0b1111111
	}

	return apex.command.byte1[command] || 0
}

const reservedCommandToBin = command => {
	if (command === 'reset') {
		return 0b1111111
	}
	return 0
}

export default apex
