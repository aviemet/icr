import React, { useEffect } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { add } from 'date-fns'
import {
	Autocomplete,
	Box,
	Button,
	Checkbox,
	Divider,
	FormControlLabel,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	Stack,
	TextField,
	Typography,
	useMediaQuery
} from '@mui/material'
import { TimePicker } from '@mui/lab'

/**
 * TextField for TimePicker - full width and readonly
 * @param params TextField params
 */
const TimeTextField = params => {
	params.fullWidth = true
	params.inputProps = params.inputProps || {}
	params.inputProps.readOnly = true
	console.log({ params })
	return <TextField { ...params } />
}

interface INewShiftFormProps {
	start: Date
	end: Date
	client: schema.Person
	employees: schema.Person[]
}

const NewShiftForm = ({ start, end, client, employees }: INewShiftFormProps) => {
	const { data, setData, post, processing, errors } = useForm<{
		starts_at: Date|null
		ends_at: Date|null
		client_id: number|null
	}>({
		starts_at: start,
		ends_at: add(end, { hours: 8 }),
		client_id: client.id
	})

	const onSubmit = e => {
		e.preventDefault()
		post('/login')
	}

	console.log({ employees })

	useEffect(() => {
		console.log({ data })
	}, [data.starts_at])

	return (
		<form noValidate onSubmit={ onSubmit }>
			<Grid container>
				<Grid item xs={ 12 }>
					<TimePicker
						label="Start Time"
						value={ data['starts_at'] }
						onChange={ val => setData('starts_at', val) }
						renderInput={ TimeTextField }
					/>
				</Grid>

				<Grid item xs={ 12 }>
					<TimePicker
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
						sx={ { width: 300 } }
						renderInput={ (params) => <TextField { ...params } label="Employe" fullWidth /> }
					/>
				</Grid>
			</Grid>
		</form>
	)
}

export default NewShiftForm
