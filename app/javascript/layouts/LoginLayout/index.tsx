import React from 'react'

const LoginLayout: React.FC = ({ children }) => {
	return (
		<div>
			<h1>Login Layout</h1>
			<div>{ children }</div>
		</div>
	)
}

export default (page: React.ReactNode) => <LoginLayout>{ page }</LoginLayout>
