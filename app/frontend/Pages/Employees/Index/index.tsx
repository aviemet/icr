import React from 'react'
import { Routes } from '@/lib'
import { Head } from '@inertiajs/react'
import { Link } from '@/Components'
import { Grid } from '@/Components'
import Table from '../Table'

const Index = ({ employees }) => {
	return (
		<>
			<Head title="Employees"></Head>

			<Grid>

				<Grid.Col xs={ 10 }>
					<h1>Employees</h1>
				</Grid.Col>
				<Grid.Col xs={ 2 }>
					<Link href={ Routes.newEmployee() } as="button">New Employee</Link>
				</Grid.Col>

				<Grid.Col xs={ 12 }>
					<Table employees={ employees } />
				</Grid.Col>

			</Grid>
		</>
	)
}

export default Index