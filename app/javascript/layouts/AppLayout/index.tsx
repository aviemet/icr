import React from 'react'
import { Container } from 'components'
import classnames from 'classnames'
import Sidebar from './Sidebar'
import Footer from './Footer'

const AppLayout = ({ children }) => {
	return (
		<>
			<Sidebar />
			<div id="content" className={ classnames('relative', 'md:ml-64', 'min-h-screen') }>
				<div className="bg-light-blue-500 md:px-8 h-40 px-3"></div>
				<Container className="md:px-8 px-3 -mt-24">{ children }</Container>
			</div>
			<Footer />
		</>
	)
}

export default (page: React.ReactNode) => <AppLayout>{ page }</AppLayout>

