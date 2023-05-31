import React from 'react'
import { Routes } from '@/lib'
import { Head } from '@inertiajs/react'
import { Link } from '@/Components'
import { Grid } from '@/Components'
import Table from '../Table'

const Index = ({ clients }) => {
	return (
		<>
			<Head title="Clients"></Head>

			<Grid>

				<Grid.Col xs={ 10 }>
					<h1>Clients</h1>
				</Grid.Col>
				<Grid.Col xs={ 2 }>
					<Link href={ Routes.newClient() } as="button">New Client</Link>
				</Grid.Col>

				<Grid.Col xs={ 12 }>
					<Table clients={ clients } />
				</Grid.Col>

			</Grid>
		</>
	)
}

export default Index