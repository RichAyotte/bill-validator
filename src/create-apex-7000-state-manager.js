/**
 * @overview    Apex 7000 state manager factory
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-27 13:18:37
 * @license     MIT License
 */

/* eslint-disable no-bitwise */

'use strict'

const {
	findKey
	, forEach
} = require('lodash')

const apex7000Spec = require('./apex-7000-spec')

/**
 * XOR buffers
 * @param  {Buffer} bufferA a buffer
 * @param  {Buffer} bufferB another buffer
 * @return {Buffer} xored buffer
 */
const xorBuffers = (bufferA, bufferB) => {
	const length = Math.max(bufferA.length, bufferB.length)
	const buffer = Buffer.alloc(length)

	for (const key of bufferA.keys()) {
		buffer[key] = bufferA[key] ^ bufferB[key]
	}

	return buffer
}

/**
 * Expresses the current state in english
 * @param  {Buffer} state the state of the validator
 * @return {Array} list of enlish words expressing the state
 */
const stateToEnglish = state => {
	const stateInEnglish = {}
	for (const [i, byte] of state.entries()) {
		forEach(apex7000Spec.status[`byte${i}`], (bitmask, status) => {
			if (i === 2 && status === 'billEscrowed') {
				const bill = findKey(bitmask, b => b === (byte >> 3))
				if (bill) {
					stateInEnglish.billEscrowed = bill
				}
				return
			}
			stateInEnglish[status] = Boolean(byte & bitmask)
		})
	}
	return stateInEnglish
}

/**
 * Apex 7000 state manager creator
 * @return {Object} state manager
 */
module.exports = () => {
	/**
	 * Mutable state
	 * @type {Object}
	 */
	let ack = 0
	const currentState = Buffer.alloc(6)
	const previousState = Buffer.alloc(6)

	const stateManager = {
		/**
		 * Communication ack
		 * @type {Number}
		 */
		get ack() {
			return ack
		}
		, flipAck() {
			ack = 1 - ack
		}

		/**
		 * 6 bytes of the bill validator hardware state
		 * @type {Object}
		 */
		, get state() {
			return stateToEnglish(currentState)
		}
		, updateState({message}) {
			currentState.copy(previousState)
			message.copy(
				currentState
				, 0
				, apex7000Spec.length.head
				, apex7000Spec.length.head + apex7000Spec.length.received
			)
		}

		/**
		 * Hardware state changes and events
		 * @return {[Object]} array of property changes
		 */
		, get stateChanges() {
			const stateChanges = xorBuffers(currentState, previousState)
			const englishState = stateToEnglish(currentState)
			const englishStateChanges = {}

			for (const [i, byte] of stateChanges.entries()) {
				/* eslint-disable complexity */
				forEach(apex7000Spec.status[`byte${i}`], (bitmask, status) => {
					/**
					 * Don't emit bill escrowed events, only bill stacked events.
					 * Leaving code here for now just in case it's needed later.
					 */
					if (i === 2	&& status === 'billEscrowed') {
						return
					}

					const diff = byte & bitmask

					if (diff) {
						englishStateChanges[status] = Boolean(diff & currentState[i])

						if (status === 'stacked') {
							if (englishState.stacked === true
								&& englishState.cheated === false
								&& englishState.failure === false
								&& englishState.invalid === false
								&& englishState.returning === false
							) {
								englishStateChanges.billStackedValue = parseInt(englishState.billEscrowed.substring(4), 10)
							}
						}
					}
				})
				/* eslint-enable complexity */
			}
			return englishStateChanges
		}
	}
	return stateManager
}
