import React from 'react'
import ReactDOM from 'react-dom'
import { type Root } from 'react-dom/client'

export const runAxe = (root?: Root) => {
	if(process.env.NODE_ENV === 'production') return

	let axeRunning = false

	const domRoot = root || ReactDOM

	if(!axeRunning) {
		axeRunning = true

		import('@axe-core/react').then(axe =>
			axe.default(React, domRoot, 0).then(() => {
				axeRunning = false
			}),
		)
	}
}
