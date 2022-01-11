import React from 'react'
import { Container } from 'components'
import classnames from 'classnames'
import Topbar from './Topbar'
import Sidebar from './Sidebar'

const AppLayout = () => {
	return (
		<>
			<Sidebar />
			<div id="content" className={ classnames('relative', 'ml-20') }>
				<Topbar />
			</div>
		</>
	)
}

export default AppLayout
