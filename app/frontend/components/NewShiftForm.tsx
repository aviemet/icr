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
	FormControlLabel,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	Stack,
	Switch,
	TextField,
	Typography,
	useMediaQuery
} from '@mui/material'
import { DateTimePicker } from '@mui/lab'
import { useAuthState } from '@/Store'

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
}

const NewShiftForm = ({ start, client, employees, onSubmit }: INewShiftFormProps) => {
	const [auth, _] = useAuthState()
	const theme = useTheme()
	const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))

	const [repeats, setRepeats] = useState(false)

	const { data, setData, post, transform, processing, errors } = useForm<{
		starts_at: Date|null
		ends_at: Date|null
		client_ids: number[]
		employee_id: number|undefined
		created_by_id: number
	}>({
		starts_at: start,
		ends_at: add(start, { hours: 8 }),
		client_ids: [client.id],
		employee_id: undefined,
		created_by_id: auth.user.id
	})
	useState
	const handleSubmit = e => {
		e.preventDefault()
		// @ts-ignore
		transform(data => ({ shift: data }))
		post(Routes.shifts(), {
			onSuccess: () => onSubmit(false)
		})
	}

	useEffect(() => {
		console.log({ errors })
	}, [errors])

	return (
		<form noValidate onSubmit={ handleSubmit }>
			<Grid container spacing={ matchDownSM ? 0 : 2 }>
				<Grid item xs={ 12 }>
					<DateTimePicker
						label="Start Time"
						value={ data['starts_at'] }
						onChange={ val => setData('starts_at', val) }
						renderInput={ TimeTextField }
					/>
				</Grid>

				<Grid item xs={ 12 }>
					<DateTimePicker
						label="End Time"
						value={ data['ends_at'] }
						onChange={ val => setData('ends_at', val) }
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
						onChange={ (_, newValue) => setData('employee_id', newValue?.id) }
						aria-describedby="employee-error-text"
						renderInput={ params => {
							params.fullWidth = true
							return <TextField
								{ ...params }
								inputProps={ { ...params.inputProps } }
								error={ !!errors.employee }
								value={ `${data['employee_id']}` }
								label="Employee"
							/>
						} }
					/>
					{ errors.employee && <FormHelperText id="employee-error-text">{ errors.employee }</FormHelperText> }
				</Grid>

				<Grid item xs={ 12 }>
					<Box sx={ { mt: 2 } }>
						<FormGroup>
							<FormControlLabel control={ <Switch checked={ repeats } onChange={ e => setRepeats(!repeats) } /> } label="Repeating Event" />
						</FormGroup>
					</Box>
				</Grid>

				{ repeats && <Box sx={ { mt: 2 } }>
					<p>Repeating</p>
				</Box> }

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
