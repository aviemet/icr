import React from 'react'
import { Routes } from '@/lib'
import { Head } from '@inertiajs/inertia-react'
import { Link } from '@/components'
import { Grid } from '@mui/material'
import Table from './Table'

const Index = ({ clients }) => {
	return (
		<>
			<Head title="Clients"></Head>

			<Grid container spacing={ 2 }>

				<Grid item xs={ 10 }>
					<h1>Clients</h1>
				</Grid>
				<Grid item xs={ 2 }>
					<Link href={ Routes.newClient() } as="button">New Client</Link>
				</Grid>

				<Grid item xs={ 12 }>
					<Table clients={ clients } />
				</Grid>

			</Grid>
		</>
	)
}

export default Index