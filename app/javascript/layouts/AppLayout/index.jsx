import React from 'react'

const AppLayout = ({ children }) => {
	return (
		<div>
			<h1>Private</h1>
			{ children }
		</div>
	)
}

export default page => <AppLayout>{ page }</AppLayout>
