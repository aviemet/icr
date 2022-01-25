import React from 'react'
import { Head } from '@inertiajs/inertia-react'
import { Link } from 'components'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { Grid } from '@mui/material'
import { Routes } from 'lib'

const columns: GridColDef[] = [
	{ field: 'email', headerName: 'Email' },
	{ field: 'f_name', headerName: 'First Name' },
	{ field: 'l_name', headerName: 'Last Name' },
	{ field: 'created_at', headerName: 'Created Date' },
]

const Index = ({ clients }) => {
	console.log({ clients, type: typeof clients })
	return (
		<>
			<Head title="Clients"></Head>

			<Grid container spacing={ 2 }>

				<Grid item xs={ 10 }>
					<h1>Clients</h1>
				</Grid>
				<Grid item xs={ 2 }>
					<Link href={ Routes.new_client_path() } as="button">New Client</Link>
				</Grid>

				<Grid item xs={ 12 }>
					<DataGrid
						rows={ clients }
						columns={ columns }
						pageSize={ 5 }
						rowsPerPageOptions={ [5] }
						checkboxSelection
					/>
				</Grid>

			</Grid>
		</>
	)
}

export default Index