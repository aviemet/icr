import React from 'react'

const Show = ({ client }) => {
	console.log({ client })
	return (
		<div>
			<pre>{ client }</pre>
		</div>
	)
}

export default Show
