import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { add, format } from 'date-fns'
import { Link, AnimateButton } from '@/components'
import { Routes } from '@/lib'
import { useTheme } from '@mui/material/styles'
import {
	Autocomplete,
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
import DateTimePicker, { DatePicker, TimePicker } from './DateTimePicker'
import Repeats from './Repeats'

/**
 * TextField for TimePicker - full width and readonly
 * @param params TextField params
 */
const TimeTextField = params => {
	params.fullWidth = true
	params.inputProps = params.inputProps || {}
	params.inputProps.readOnly = true
	return <TextField { ...params } />
}

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

	const { data, setData, post, transform, processing, errors } = useForm<{
		starts_at: Date
		ends_at: Date
		client_ids: number[]
		employee: number|undefined
		created_by_id: number
		recurring_type?: 'daily'|'weekly'|'monthly'|'yearly'
		offset?: number
		max_occurances?: string
		day_of_week?: string
		day_of_month?: string
		month_of_year?: string
	}>({
		starts_at: start,
		ends_at: add(start, { hours: 8 }),
		client_ids: [client.id],
		employee: undefined,
		created_by_id: auth.user.id
	})

	const handleSubmit = e => {
		e.preventDefault()
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

	useEffect(() => {
		console.log({ offsetForm: data.offset })
	}, [data.offset])

	return (
		<form noValidate onSubmit={ handleSubmit }>
			<Grid container spacing={ matchDownSM ? 0 : 2 }>
				{ /* Employee */ }
				<Grid item xs={ 12 }>
					<Autocomplete
						fullWidth
						disablePortal
						size="small"
						id="combo-box-demo"
						options={ employees.map(e => ({
							label: `${e.f_name} ${e.l_name}`,
							id: e.id
						})) }
						onChange={ (_, newValue) => setData('employee', newValue?.id) }
						aria-describedby="employee-error-text"
						renderInput={ params => {
							params.fullWidth = true
							return <TextField
								variant="standard"
								{ ...params }
								inputProps={ { ...params.inputProps } }
								error={ !!errors.employee }
								value={ `${data['employee']}` }
								label="Employee"
							/>
						} }
					/>
					{ errors.employee && <FormHelperText id="employee-error-text">{ errors.employee }</FormHelperText> }
				</Grid>

				{ /* Start */ }
				<Grid container item xs={ 12 } md={ 6 }>
					<Grid item xs={ 8 }>
						<DatePicker
							label="Start"
							value={ data['starts_at'] }
							onChange={ val => {
								if(!(val instanceof Date)) return
								setData('starts_at', val)
							} }
						/>
					</Grid>
					<Grid item xs={ 4 }>
						<TimePicker
							value={ data['starts_at'] }
							onChange={ val => {
								if(!(val instanceof Date)) return
								setData('starts_at', val)
							} }
						/>
					</Grid>
				</Grid>

				{ /* End */ }
				<Grid container item xs={ 12 } md={ 6 }>
					<Grid item xs={ 4 }>
						<TimePicker
							value={ data['ends_at'] }
							onChange={ val => {
								if(!(val instanceof Date)) return
								setData('ends_at', val)
							} }
						/>
					</Grid>
					<Grid item xs={ 8 }>
						<DatePicker
							label="End"
							value={ data['ends_at'] }
							onChange={ val => {
								if(!(val instanceof Date)) return
								setData('ends_at', val)
							} }
						/>
					</Grid>
				</Grid>

				{ /* Repeats */ }
				<Repeats data={ data } setData={ setData } />

				<Grid item xs={ 12 }>
					<Box sx={ { mt: 2 } }>
						<AnimateButton>
							<Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary" disabled={ processing }>
								Save Shift
							</Button>
						</AnimateButton>
					</Box>
				</Grid>
			</Grid>
		</form>
	)
}

export default NewShiftForm
