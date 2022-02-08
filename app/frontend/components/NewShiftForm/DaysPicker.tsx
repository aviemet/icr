import React, { useState, useEffect } from 'react'
import {
	Checkbox,
	FormGroup,
	FormControl,
	FormControlLabel,
} from '@mui/material'
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
