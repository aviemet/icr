import React, { useCallback } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { add, format } from 'date-fns'
import { Link, AnimateButton } from '@/components'
import { Form, Autocomplete, DateTimePicker, Submit } from '@/components/Form'
import { Routes } from '@/lib'
import { useTheme } from '@mui/material/styles'
import {
	// Autocomplete,
	Box,
	Button,
	Checkbox,
	Divider,
	FormGroup,
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Switch,
	TextField,
	Typography,
	useMediaQuery
} from '@mui/material'
// import { DateTimePicker } from '@mui/lab'
import { useAuthState } from '@/Store'
import DaysPicker from './DaysPicker'
import Repeats from './Repeats'

interface INewShiftFormProps {
	start: Date
	end: Date
	client: schema.Person
	employees: schema.Person[]
	onSubmit: () => void
}

const NewShiftForm: React.FC<INewShiftFormProps> = ({ start, client, employees, onSubmit }) => {
	const [auth, _] = useAuthState()
	const theme = useTheme()
	const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))

	const data = {
		starts_at: start,
		ends_at: add(start, { hours: 8 }),
		client_ids: [client.id],
		employee: undefined,
		created_by_id: auth.user.id
	}

	// const { data, setData, post, transform, processing, errors } = useForm<{
	// 	starts_at: Date
	// 	ends_at: Date
	// 	client_ids: number[]
	// 	employee: number|undefined
	// 	created_by_id: number
	// 	recurring_type?: 'daily'|'weekly'|'monthly'|'yearly'
	// 	offset?: number
	// 	max_occurances?: string
	// 	day_of_week?: string
	// 	day_of_month?: string
	// 	month_of_year?: string
	// }>({
	// 	starts_at: start,
	// 	ends_at: add(start, { hours: 8 }),
	// 	client_ids: [client.id],
	// 	employee: undefined,
	// 	created_by_id: auth.user.id
	// })

	const handleSubmit = ({ transform, post }) => {
		// @ts-ignore
		transform(data => ({
			shift: {
				starts_at: data.starts_at,
				ends_at: data.ends_at,
				client_ids: data.client_ids,
				employee_id: data.employee,
				created_by_id: data.created_by_id,
				recurring_pattern_attributes: {
					recurring_type: data.recurring_type,
					offset: data.offset,
					max_occurances: data.max_occurances,
					day_of_week: data.day_of_week,
					day_of_month: data.day_of_month,
					month_of_year: data.month_of_year,
				}
			}
		}))
		post(Routes.shifts(), {
			onSuccess: () => { if(onSubmit) onSubmit() }
		})
	}

	return (
		<Form noValidate onSubmit={ handleSubmit }>
			<Grid container spacing={ matchDownSM ? 0 : 2 }>
				{ /* Employee */ }
				<Grid item xs={ 12 }>
					<Autocomplete
						label="Employee"
						name="employee"
						options={ useCallback(() => employees.map(e => ({
							label: `${e.f_name} ${e.l_name}`,
							id: e.id
						})), [employees])() }
					/>
				</Grid>

				{ /* Start */ }
				<Grid container item xs={ 12 } md={ 6 }>
					<Grid item xs={ 8 }>
						<DateTimePicker
							name="starts_at"
							label="Start"
							inputFormat="EEEE, MMM do"
						/>
					</Grid>
					<Grid item xs={ 4 }>
						<DateTimePicker
							name="starts_at"
							openTo="hours"
							inputFormat="hh:mm a"
						/>
					</Grid>
				</Grid>

				{ /* End */ }
				<Grid container item xs={ 12 } md={ 6 }>
					<Grid item xs={ 4 }>
						<DateTimePicker
							name="ends_at"
							openTo="hours"
							inputFormat="hh:mm a"
						/>
					</Grid>
					<Grid item xs={ 8 }>
						<DateTimePicker
							name="ends_at"
							label="End"
							inputFormat="EEEE, MMM do"
						/>
					</Grid>
				</Grid>

				{ /* Repeats */ }
				{ /* <Repeats data={ data } setData={ setData } /> */ }

				<Grid item xs={ 12 }>
					<Box sx={ { mt: 2 } }>
						<Submit />
					</Box>
				</Grid>
			</Grid>
		</Form>
	)
}

export default NewShiftForm
