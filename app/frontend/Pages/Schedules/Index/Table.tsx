import * as React from 'react'
import { Routes } from '@/lib'
import { Link } from '@/Components'
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

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1
	}
	if (b[orderBy] > a[orderBy]) {
		return 1
	}
	return 0
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key,
): (
		a: { [key in Key]: number | string },
		b: { [key in Key]: number | string },
	) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy)
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
	const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0])
		if (order !== 0) {
			return order
		}
		return a[1] - b[1]
	})
	return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
	disablePadding: boolean
	id: keyof schema.Person
	label: string
	numeric: boolean
}

const headCells: readonly HeadCell[] = [
	{
		id: 'first_name',
		numeric: false,
		disablePadding: true,
		label: 'First Name',
	},
	{
		id: 'last_name',
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

interface EnhancedTableProps {
	numSelected: number
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof schema.Person) => void
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
	order: Order
	orderBy: string
	rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props
	const createSortHandler =
    (property: keyof schema.Person) => (event: React.MouseEvent<unknown>) => {
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

interface EnhancedTableToolbarProps {
	numSelected: number
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const { numSelected } = props

	return (
		<Toolbar
			sx={ {
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: (theme) =>
						alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
				}),
			} }
		>
			{ numSelected > 0 ? (
				<Typography
					sx={ { flex: '1 1 100%' } }
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{ numSelected } selected
				</Typography>
			) : (
				<Typography
					sx={ { flex: '1 1 100%' } }
					variant="h6"
					id="tableTitle"
					component="div"
				>
          Nutrition
				</Typography>
			) }
			{ numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title="Filter list">
					<IconButton>
						<FilterListIcon />
					</IconButton>
				</Tooltip>
			) }
		</Toolbar>
	)
}

type Id = string | number

const EnhancedTable = ({ clients }: { clients: schema.Person[] }) => {
	const [order, setOrder] = React.useState<Order>('asc')
	const [orderBy, setOrderBy] = React.useState<keyof schema.Person>('first_name')
	const [selected, setSelected] = React.useState<readonly Id[]>([])
	const [page, setPage] = React.useState(0)
	const [dense, setDense] = React.useState(false)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)

	const handleRequestSort = (
		event: React.MouseEvent<unknown>,
		property: keyof schema.Person,
	) => {
		const isAsc = orderBy === property && order === 'asc'
		setOrder(isAsc ? 'desc' : 'asc')
		setOrderBy(property)
	}

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelecteds = clients.map((n) => n.id)
			setSelected(newSelecteds)
			return
		}
		setSelected([])
	}

	const handleClick = (event: React.MouseEvent<unknown>, id: Id) => {
		const selectedIndex = selected.indexOf(id)
		let newSelected: readonly Id[] = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			)
		}

		setSelected(newSelected)
	}

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

	const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDense(event.target.checked)
	}

	const isSelected = (id: Id) => selected.indexOf(id) !== -1

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - clients.length) : 0

	return (
		<Box sx={ { width: '100%' } }>
			<Paper sx={ { width: '100%', mb: 2 } }>
				<EnhancedTableToolbar numSelected={ selected.length } />
				<TableContainer>
					<Table
						sx={ { minWidth: 750 } }
						aria-labelledby="tableTitle"
						size={ dense ? 'small' : 'medium' }
					>
						<EnhancedTableHead
							numSelected={ selected.length }
							order={ order }
							orderBy={ orderBy }
							onSelectAllClick={ handleSelectAllClick }
							onRequestSort={ handleRequestSort }
							rowCount={ clients.length }
						/>
						<TableBody>
							{ /* if you don't need to support IE11, you can replace the `stableSort` call with:
              clients.slice().sort(getComparator(order, orderBy)) */ }
							{ stableSort<schema.Person>(clients, getComparator(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
									const isItemSelected = isSelected(row.id)
									const labelId = `enhanced-table-checkbox-${index}`

									return (
										<TableRow
											hover
											role="checkbox"
											aria-checked={ isItemSelected }
											tabIndex={ -1 }
											key={ row.id }
											selected={ isItemSelected }
										>
											<TableCell padding="checkbox">
												<Checkbox
													color="primary"
													onClick={ (event) => handleClick(event, row.id) }
													checked={ isItemSelected }
													inputProps={ {
														'aria-labelledby': labelId,
													} }
												/>
											</TableCell>
											<TableCell
												component="th"
												id={ labelId }
												scope="row"
												padding="none"
											>
												<Link href={ Routes.scheduleClient(row.slug) }>{ row.first_name }</Link>
											</TableCell>
											<TableCell><Link href={ Routes.scheduleClient(row.slug) }>{ row.last_name }</Link></TableCell>
											<TableCell><Link href={ Routes.scheduleClient(row.slug) }>{ row.slug }</Link></TableCell>
										</TableRow>
									)
								}) }
							{ emptyRows > 0 && (
								<TableRow
									style={ {
										height: (dense ? 33 : 53) * emptyRows,
									} }
								>
									<TableCell colSpan={ 6 } />
								</TableRow>
							) }
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={ [5, 10, 25] }
					component="div"
					count={ clients.length }
					rowsPerPage={ rowsPerPage }
					page={ page }
					onPageChange={ handleChangePage }
					onRowsPerPageChange={ handleChangeRowsPerPage }
				/>
			</Paper>
			<FormControlLabel
				control={ <Switch checked={ dense } onChange={ handleChangeDense } /> }
				label="Dense padding"
			/>
		</Box>
	)
}

export default EnhancedTable
