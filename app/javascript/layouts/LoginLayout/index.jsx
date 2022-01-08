import React from 'react'

const LoginLayout = ({ children }) => {
	return (
		<div>
			<h1>Public</h1>
			{ children }
		</div>
	)
}

export default page => <LoginLayout>{ page }</LoginLayout>
