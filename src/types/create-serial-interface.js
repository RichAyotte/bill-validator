/**
 * @overview    Create serial interface type
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-22 17:16:08
 * @license     MIT License
 */

'use strict'

const {FunctionModel, ObjectModel} = require('objectmodel')
const IOInterface = require('./io-interface')

const SerialInterfaceOptions = ObjectModel({
	port: String
	, portOptions: Object
})

module.exports = FunctionModel(SerialInterfaceOptions).return(IOInterface)
