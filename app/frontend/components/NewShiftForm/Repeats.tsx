import React, { useState, useEffect } from 'react'
import {
	Box,
	Button,
	ButtonGroup,
	FormGroup,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	InputBase,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Select,
	Switch,
} from '@mui/material'
import DaysPicker from './DaysPicker'
import { useForm, DatePicker, NumberInput } from '@/components/Form'
import { add } from 'date-fns'

const Repeats = () => {
	const { data, setData } = useForm()

	const pluralize = () => {
		if(data.offset && data.offset > 1) {
			return 's'
		}
	}

	useEffect(() => {
		if(data.is_recurring) {
			setData({
				...data,
				offset: 1,
				end_type: 'never',
				max_occurances: 10,
				end_date: add(data.ends_at, { weeks: 1 }),
				recurring_type: 'daily'
			})
		} else {
			setData({
				...data,
				offset: undefined,
				recurring_type: undefined,
				end_type: undefined,
				end_date: undefined,
				max_occurances: undefined,
				day_of_week: undefined,
				week_of_month: undefined,
				day_of_month: undefined,
				month_of_year: undefined,
			})
		}
	}, [data.is_recurring])

	useEffect(() => {
		console.log({ is_recurring: data.is_recurring })
	}, [data.is_recurring])

	return (
		<>
			<Grid item xs={ 12 }>
				<FormGroup>
					<Grid container>
						{ /* Toggle */ }
						<Grid item xs={ 4 }>
							<FormControlLabel
					 			label={ data.is_recurring ? 'Repeats Every' : 'Does Not Repeat' }
								control={ <Switch
									checked={ data.is_recurring }
									onChange={ e => setData('is_recurring', e.target.checked) }
								/> }
							/>
						</Grid>

						{ data.is_recurring && data['recurring_type'] !== undefined && <>
							{ /* Offset */ }
							<Grid item xs={ 3 }>
								<NumberInput name="offset" min={ 1 } />
							</Grid>

							{ /* Reccurance Type */ }
							<Grid item xs={ 5 }>
								<FormControl>
									<Select
										fullWidth
										variant="standard"
										id="repeat-shift-select"
										value={ data.recurring_type }
										onChange={ (e) => {
											const val = e.target.value
											setData('recurring_type', val /*=== '' ? undefined : val*/)
										} }
									>
										<MenuItem value='daily' selected>Day{ pluralize() }</MenuItem>
										<MenuItem value='weekly'>Week{ pluralize() }</MenuItem>
										<MenuItem value='monthly'>Month{ pluralize() }</MenuItem>
										<MenuItem value='yearly'>Year{ pluralize() }</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							{ /* Weekday Checkboxes */ }
							{ data.recurring_type === 'weekly' &&
								<Grid item xs={ 12 }>
									<Box sx={ { mt: 2 } }>
										<DaysPicker setData={ setData } />
									</Box>
								</Grid>
							}

							{ /* Recurrance End Criteria */ }
							<Grid item xs={ 12 }>
								<FormControl>
									<FormLabel id="recurrance-ending-label">Ends</FormLabel>
									<RadioGroup
										aria-labelledby="recurrance-ending-label"
										defaultValue="never"
										name="radio-buttons-group"
										value={ data.end_type }
										onChange={ e => setData('end_type', e.target.value) }
									>
										<FormControlLabel value="never" control={ <Radio /> } label="Never" />
										<FormControlLabel value="date" control={ <Radio /> } label={ <>
											On
											<DatePicker name="end_date" inputFormat="EEEE, MMM do" />
										</> } />
										<FormControlLabel value="occurances" control={ <Radio /> } label={ <>
											After
											<NumberInput name="max_occurances" min={ 1 } />
										</> } />
									</RadioGroup>
								</FormControl>
							</Grid>
						</> }

					</Grid>
				</FormGroup>
			</Grid>

		</>
	)
}

export default Repeats
