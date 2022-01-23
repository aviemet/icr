import React from 'react'
import { Head } from '@inertiajs/inertia-react'
import { Avatar } from '@mui/material'

const Home = ({ name }) => {
	return (
		<>
			<Head title="Home"></Head>
			<div>
				<h1>Hello { name }</h1>
				<Avatar>HI</Avatar>
			</div>
		</>
	)
}

export default Home
