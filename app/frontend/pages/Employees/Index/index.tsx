import React from 'react'
import { Routes } from '@/lib'
import { Head } from '@inertiajs/inertia-react'
import { Link } from '@/components'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Grid } from '@mui/material'
import { format } from 'date-fns'
import { useTheme } from '@mui/material/styles'

const columns: GridColDef[] = [
	{ field: 'id', headerName: 'ID', width: 40 },
	{ field: 'f_name', headerName: 'First Name', width: 160 },
	{ field: 'l_name', headerName: 'Last Name', width: 160 },
	{ field: 'created_at', headerName: 'Created Date', width: 160	},
]

const Index = ({ employees }) => {
	const theme = useTheme()
	console.log({ theme })
	return (
		<>
			<Head title="Employees"></Head>

			<Grid container spacing={ 2 }>

				<Grid item xs={ 10 }>
					<h1>Employees</h1>
				</Grid>
				<Grid item xs={ 2 }>
					<Link href={ Routes.newClient() } as="button">New Client</Link>
				</Grid>

				<Grid item xs={ 12 }>
					<DataGrid
						rows={ employees }
						columns={ columns }
						pageSize={ 5 }
						rowsPerPageOptions={ [5] }
						checkboxSelection
						sx={ theme => ({
							height: 400,
							backgroundColor: theme.palette.grey[50]
						}) }
					/>
				</Grid>

			</Grid>
		</>
	)
}

export default Index