import React from 'react'
import { Container } from 'components'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { Head } from '@inertiajs/inertia-react'

const AppLayout = ({ children }) => {
	return (
		<>
			<Head title="Inclusive Community Resources" />
			<Sidebar />
			<div id="content" className='md:ml-64 relative min-h-screen'>
				<div className="bg-light-blue-500 md:px-8 h-40 px-3"></div>
				<Container className="md:px-8 px-3 -mt-24">{ children }</Container>
			</div>
			<Footer />
		</>
	)
}

export default (page: React.ReactNode) => <AppLayout>{ page }</AppLayout>

