/**
 * @overview    Create bill validator type
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-20 13:38:59
 * @license     MIT License
 */

import {FunctionModel, ObjectModel} from 'objectmodel'
import BillValidator from './bill-validator.js'
import IOInterface from './io-interface.js'

const BillValidatorOptions = ObjectModel({
	ioInterface: IOInterface
})

export default FunctionModel(BillValidatorOptions).return(BillValidator)
