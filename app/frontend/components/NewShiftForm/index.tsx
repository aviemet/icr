import React, { useState, useEffect } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { add } from 'date-fns'
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
import { DateTimePicker } from '@mui/lab'
import { useAuthState } from '@/Store'
import DaysPicker from './DaysPicker'

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
		separation_count?: number
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
					separation_count: data.separation_count,
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

	const pluralize = () => {
		if(data.separation_count && data.separation_count > 1) {
			return 's'
		}
	}

	useEffect(() => {
		console.log(data)
	}, [data])

	return (
		<form noValidate onSubmit={ handleSubmit }>
			<Grid container spacing={ matchDownSM ? 0 : 2 }>
				<Grid item xs={ 12 }>
					<DateTimePicker
						label="Start Time"
						value={ data['starts_at'] }
						onChange={ val => {
							if(val === null) return
							setData('starts_at', val)
						} }
						renderInput={ TimeTextField }
					/>
				</Grid>

				<Grid item xs={ 12 }>
					<DateTimePicker
						label="End Time"
						value={ data['ends_at'] }
						onChange={ val => {
							if(val === null) return
							setData('ends_at', val)
						} }
						renderInput={ TimeTextField }
					/>
				</Grid>

				<Grid item xs={ 12 }>
					<Autocomplete
						fullWidth
						disablePortal
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

				<Grid item xs={ 12 }>
					<Box sx={ { mt: 2 } }>
						<label>Repeat Every</label>
						<TextField
							label="Every"
							name="interval"
							value={ data.separation_count || '' }
							onChange={ e => {
								const val = parseInt(e.target.value)
								setData('separation_count', isNaN(val) ? undefined : val)
							} }
						/>
						<FormControl>
							<InputLabel id="repeat-shift-select-label">Repeat Every</InputLabel>
							<Select
								label="Repeat Every"
								labelId="repeat-shift-select-label"
								id="repeat-shift-select"
								value={ data.recurring_type || '' }
								onChange={ (e: SelectChangeEvent<typeof data.recurring_type>) => {
									const val = e.target.value
									setData('recurring_type', val === '' ? undefined : val)
								} }
							>
								<MenuItem value=""><em>Never</em></MenuItem>
								<MenuItem value='daily'>Day{ pluralize() }</MenuItem>
								<MenuItem value='weekly'>Week{ pluralize() }</MenuItem>
								<MenuItem value='monthly'>Month{ pluralize() }</MenuItem>
								<MenuItem value='yearly'>Year{ pluralize() }</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</Grid>

				{ data.recurring_type === 'daily' && <Grid item xs={ 12 }>
					<Box sx={ { mt: 2 } }>
						<DaysPicker setData={ setData } />
					</Box>
				</Grid> }

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
