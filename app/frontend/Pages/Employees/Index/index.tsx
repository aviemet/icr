import React from 'react'
import { Routes } from '@/lib'
import { Head } from '@inertiajs/react'
import { Link, Section } from '@/Components'
import { Grid } from '@/Components'
import Table from '../Table'

interface EmployeesIndexProps {
	employees: Schema.EmployeesIndex[]
}

const EmployeesIndex = ({ employees }: EmployeesIndexProps) => {
	return (
		<>
			<Head title="Employees"></Head>

			<Section>
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
			</Section>
		</>
	)
}

export default EmployeesIndex
