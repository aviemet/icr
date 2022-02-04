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
import { Set } from 'immutable'

const DaysPicker = ({ setData }) => {
	const [days, setDays] = useState<Set<string>>(Set())

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if(event.target.checked) {
			setDays(days.add(event.target.value))
		} else {
			setDays(days.remove(event.target.value))
		}
	}

	useEffect(() => {
		setData('day_of_week', days.toArray().join(' '))
		console.log(days.toArray())
	}, [days])

	useEffect(() => {
		return setData('day_of_week', undefined)
	}, [])

	return (
		<FormControl component="fieldset">
			<FormGroup aria-label="position" row>
				{ ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'].map(day => (
					<FormControlLabel
						key={ day }
						value={ day }
						control={ <Checkbox onChange={ handleCheckboxChange } /> }
						label={ day }
						labelPlacement="bottom"
					/> )) }
			</FormGroup>
		</FormControl>
	)
}

export default DaysPicker
