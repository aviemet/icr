import React from 'react'
import { Navbar } from 'components'
import classnames from 'classnames'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'

const Topbar = () => {
	return (
		<Navbar navbar fixed className={ classnames('h-20', 'border-b-2') }>
			<h1>Stuff</h1>
		</Navbar>
	)
}

export default Topbar
