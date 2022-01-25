import React from 'react'
import { Head } from '@inertiajs/inertia-react'

const Home = (props) => {

	return (
		<>
			<Head title="Home"></Head>
			<div>
				<h1>Hello { props.name }</h1>
			</div>
		</>
	)
}

export default Home
