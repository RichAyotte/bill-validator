/**
 * @overview    APEX 7000 bill validator
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-27 12:19:09
 * @license     MIT License
 */

import CreateBillValidatorType from './types/create-bill-validator.js'
import createApex7000StateManager from './create-apex-7000-state-manager.js'
import BillValidator from './types/bill-validator.js'
import apex7000Spec from './apex-7000-spec.js'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Bill validator factory function
 * @param  {IOInterface} IO interface
 * @return {BillValidator} Bill validator
 */
const createBillValidator = ({ioInterface}) => {
	const intervalMilliseconds = 100
	let pollInterval = false
	let isCommandPending = false
	const stateManager = createApex7000StateManager()

	/**
	 * Send commands to io interface
	 * @param  {Object} commands see apex-7000-spec.js for commands
	 * @return {Promise} resolved when command sent
	 */
	const sendCommands = async commands => {
		const message = apex7000Spec.commandsToMessage({
			ack: stateManager.ack
			, commands
		})

		return ioInterface.write(message)
	}

	/**
	 * Enalble all bills by default
	 * @type {Array}
	 */
	const billCommands = [
		'enableBill1'
		, 'enableBill2'
		, 'enableBill5'
		, 'enableBill10'
		, 'enableBill20'
		, 'enableBill50'
		, 'enableBill100'
	]

	ioInterface.setOptions({
		rxMessageLength: apex7000Spec.getMessageLength('received')
	})

	const getStatus = async () => {
		await sendCommands()
	}

	const reset = async () => {
		await sendCommands({
			type: 'reset'
		})
		await delay(3000)
	}

	const stack = async () => {
		await sendCommands({
			billCommands
			, validatorCommand: 'stack'
		})
	}

	const apex7000 = BillValidator({
		accept() {
			clearInterval(pollInterval)
			pollInterval = setInterval(stack, intervalMilliseconds)
		}
		, idle() {
			if (isCommandPending) {
				return
			}

			if (stateManager.state.idling === true) {
				clearInterval(pollInterval)
				pollInterval = setInterval(getStatus, intervalMilliseconds)
				return
			}

			isCommandPending = true
			apex7000.once('ready', () => {
				isCommandPending = false
				clearInterval(pollInterval)
				pollInterval = setInterval(getStatus, intervalMilliseconds)
			})
		}
		, async start() {
			ioInterface.on('data', message => {
				const receivedAck = apex7000Spec.getMessageAck(message)
				if (stateManager.ack === receivedAck) {
					stateManager.flipAck()
					stateManager.updateState({message})
					Object.entries(stateManager.stateChanges).forEach(([prop, value]) => {
						apex7000.emit(prop, value)
					})
				}
			})
			await ioInterface.open()
			await reset()
		}
		, async stop() {
			apex7000.removeAllListeners()
			return ioInterface.close()
		}
	})

	apex7000.on('idling', isIdling => {
		if (isIdling === true) {
			apex7000.emit('ready', true)
		}
	})

	return apex7000
}

export default CreateBillValidatorType(createBillValidator)
