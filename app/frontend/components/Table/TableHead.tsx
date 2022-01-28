import * as React from 'react'
import { alpha } from '@mui/material/styles'
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Toolbar,
	Typography,
	Paper,
	Checkbox,
	IconButton,
	Tooltip,
	FormControlLabel,
	Switch
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { visuallyHidden } from '@mui/utils'


type Order = 'asc' | 'desc';

interface EnhancedTableProps {
	numSelected: number
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof schema.Client) => void
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
	order: Order
	orderBy: string
	rowCount: number
}

interface HeadCell {
	disablePadding: boolean
	id: keyof schema.Client
	label: string
	numeric: boolean
}

const headCells: readonly HeadCell[] = [
	{
		id: 'f_name',
		numeric: false,
		disablePadding: true,
		label: 'First Name',
	},
	{
		id: 'l_name',
		numeric: false,
		disablePadding: false,
		label: 'Last Name',
	},
	{
		id: 'slug',
		numeric: false,
		disablePadding: false,
		label: 'Slug',
	},
]

const EnhancedTableHead = ({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }: EnhancedTableProps) => {
	const createSortHandler =
    (property: keyof schema.Client) => (event: React.MouseEvent<unknown>) => {
    	onRequestSort(event, property)
    }

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={ numSelected > 0 && numSelected < rowCount }
						checked={ rowCount > 0 && numSelected === rowCount }
						onChange={ onSelectAllClick }
						inputProps={ {
							'aria-label': 'select all desserts',
						} }
					/>
				</TableCell>
				{ headCells.map((headCell) => (
					<TableCell
						key={ headCell.id }
						align={ headCell.numeric ? 'right' : 'left' }
						padding={ headCell.disablePadding ? 'none' : 'normal' }
						sortDirection={ orderBy === headCell.id ? order : false }
					>
						<TableSortLabel
							active={ orderBy === headCell.id }
							direction={ orderBy === headCell.id ? order : 'asc' }
							onClick={ createSortHandler(headCell.id) }
						>
							{ headCell.label }
							{ orderBy === headCell.id ? (
								<Box component="span" sx={ visuallyHidden }>
									{ order === 'desc' ? 'sorted descending' : 'sorted ascending' }
								</Box>
							) : null }
						</TableSortLabel>
					</TableCell>
				)) }
			</TableRow>
		</TableHead>
	)
}

export default EnhancedTableHead
