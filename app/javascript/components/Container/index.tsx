import React from 'react'


const Container = ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div { ...rest }>
			{ children }
		</div>
	)
}

export default Container