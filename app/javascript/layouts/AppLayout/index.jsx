import React from 'react'
import { Button } from 'rsuite'

const AppLayout = ({ children }) => {
	return (
		<div>
			<h1>Private</h1>
			<Button>Test</Button>
			{ children }
		</div>
	)
}

export default page => <AppLayout>{ page }</AppLayout>
