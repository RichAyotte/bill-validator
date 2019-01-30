/**
 * @overview    Create bill validator type
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-20 13:38:59
 * @license     MIT License
 */

'use strict'

const {FunctionModel, ObjectModel} = require('objectmodel')
const BillValidator = require('./bill-validator')
const IOInterface = require('./io-interface')
const BillValidatorOptions = ObjectModel({
	ioInterface: IOInterface
})

module.exports = FunctionModel(BillValidatorOptions).return(BillValidator)
