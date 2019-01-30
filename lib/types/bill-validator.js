/**
 * @overview    Bill validator type
 * @author      Richard Ayotte
 * @copyright   Copyright © 2019 Richard Ayotte
 * @date        2019-01-22 19:15:26
 * @license     MIT License
 */

'use strict'

const {EventEmitter2} = require('eventemitter2')
const {ObjectModel, FunctionModel} = require('objectmodel')

module.exports = ObjectModel({
	accept: FunctionModel()
	, idle: FunctionModel()
	, start: FunctionModel().return(Promise)
	, stop: FunctionModel().return(Promise)
}).extend(EventEmitter2)
