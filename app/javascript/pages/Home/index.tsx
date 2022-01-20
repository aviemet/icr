import React from 'react'
import { Head } from '@inertiajs/inertia-react'

const Home = ({ name }) => {
	return (
		<>
			<Head title="Home"></Head>
			<div>
				<h1>Hello { name }</h1>
			</div>
		</>
	)
}

export default Home
