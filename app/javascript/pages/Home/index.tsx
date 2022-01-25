import React from 'react'
import { Head } from '@inertiajs/inertia-react'
import { Link } from 'components'
import { Routes } from 'lib'
import { Inertia } from '@inertiajs/inertia'
import { Button } from '@mui/material'
// import { Avatar } from '@mui/material'
import axios from 'axios'

const Home = ({ name }) => {
	const handleLogout = e => {
		e.preventDefault()
		const csrfToken = document.querySelector('meta[name=csrf-token]').content
		console.log({ csrfToken, axios: axios.defaults.headers.common['X-CSRF-Token'] })

		Inertia.visit(Routes.destroy_user_session_path(), {
			method: 'delete'
		})
	}
	return (
		<>
			<Head title="Home"></Head>
			<div>
				<h1>Hello { name }</h1>
				{ /* <Link href={ Routes.destroy_user_session_path() }>Log Out</Link> */ }
				<Button onClick={ handleLogout }>Log Out</Button>
			</div>
		</>
	)
}

export default Home
