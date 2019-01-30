# bill-validator

A Node.js library to facilitate the use of bill validators.

## Supported Validators
PR are welcome

- [Apex 7000](https://pyramidacceptors.com/products/apex-7000-series)

## Getting started

### Installation

Using yarn
```shell
$ yarn add bill-validator
```

Using npm
```shell
$ npm i --save bill-validator
```

### Usage
```js
'use strict'

const {createApex7000, createSerialInterface} = require('bill-validator')

const main = async () => {
	// Create a IO Interface
	const serialInterface = createSerialInterface({
		port: '/dev/ttyUSB0'
		, portOptions: {
			autoOpen: false
			, baudRate: 9600
			, dataBits: 7
			, parity: 'even'
			, stopBits: 1
		}
	})

	// Create the Bill validator
	const apex7000 = createApex7000({
		ioInterface: serialInterface
	})


	// Listen for events
	apex7000.onAny((event, value) => {
		console.log({[event]: value})
	})

	// Start
	await apex7000.start()

	// Accept
	apex7000.accept()
}

main()
```

## Contributing

### Style
My style is a bit unorthodox and has evolved over 20 years of development. It's not what the cool kids are doing but hey, you might like it!

[eslint-config-ayotte](https://www.npmjs.com/package/eslint-config-ayotte)

### Process
1. Write test
2. Write code
3. Assure that there are not test or lint errors
4. Submit PR

## License

[MIT](./LICENSE)
