import React from 'react'
import { Container } from 'components'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

const AppLayout = () => {
	return (
		<Container id="grid-layout">
			<Sidebar />
			<Topbar />
		</Container>
	)
}

export default AppLayout
