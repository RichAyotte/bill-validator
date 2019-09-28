/**
 * @overview    Create serial interface type
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-22 17:16:08
 * @license     MIT License
 */

import {FunctionModel, ObjectModel} from 'objectmodel'
import IOInterface from './io-interface.js'

const SerialInterfaceOptions = ObjectModel({
	port: String
	, portOptions: Object
})

export default FunctionModel(SerialInterfaceOptions).return(IOInterface)
