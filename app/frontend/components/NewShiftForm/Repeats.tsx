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

const Repeats = () => {
	const { data, setData } = useForm()

	const [repeats, setRepeats] = useState(false)

	const pluralize = () => {
		if(data.offset && data.offset > 1) {
			return 's'
		}
	}

	useEffect(() => {
		setData({
			...data,
			offset: repeats ? 1 : undefined,
			recurring_type: repeats ? 'daily' : undefined
		})
		if(!repeats) {
			setData({
				...data,
				max_occurances: undefined,
				day_of_week: undefined,
				week_of_month: undefined,
				day_of_month: undefined,
				month_of_year: undefined
			})
		}
	}, [repeats])

	return (
		<>
			<Grid item xs={ 12 }>
				<FormGroup>
					<Grid container>
						{ /* Toggle */ }
						<Grid item xs={ 4 }>
							<FormControlLabel
					 			label={ repeats ? 'Repeats Every' : 'Does Not Repeat' }
								control={ <Switch
									checked={ repeats }
									onChange={ e => setRepeats(e.target.checked) }
								/> }
							/>
						</Grid>

						{ repeats && <>
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
										value={ data.recurring_type || '' }
										onChange={ (e) => {
											const val = e.target.value
											setData('recurring_type', val === '' ? undefined : val)
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
									>
										<FormControlLabel value="never" control={ <Radio /> } label="Never" />
										<FormControlLabel value="date" control={ <Radio /> } label={ <>
											<label>On</label><DatePicker name="end_date" inputFormat="EEEE, MMM do" />
										</> } />
										<FormControlLabel value="occurances" control={ <Radio /> } label="After" />
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

interface IWeekdayButtonsProps {
	value: number
	onChange: (count: number) => void
	min?: number
	max?: number
}

const WeekdayButtons = ({ value, min, max, onChange }: IWeekdayButtonsProps) => {
	const handleIncrement = () => {
		if(max === undefined || value + 1 <= max) onChange(value + 1)
	}

	const handleDecrement = () => {
		if(min === undefined || value - 1 >= min) onChange(value - 1)
	}

	const buttonSx = {
		lineHeight: 0.5,
		padding: '5px 5px',
		borderRadius: '7px',
		borderBottomLeftRadius: 0,
		borderTopLeftRadius: 0,
	}

	return (
		<Paper
			variant="outlined"
			sx={ { pl: '4px', flex: 1, display: 'flex', alignItems: 'center', width: 60 } }
		>
			<InputBase
				size="small"
				inputProps={ {
					inputMode: 'numeric',
					pattern: '[0-9]*',
				} }
				name="interval"
				value={ value || 0 }
				onChange={ e => onChange(parseInt(e.target.value)) }
				sx={ {
					paddingTop: '4px',
					width: 50,
					ml: 1,
					flex: 1
				} }
			/>
			<ButtonGroup size="small" orientation="vertical" aria-label="small outlined button group" sx={ {
				'.MuiButtonGroup-grouped': {
					minWidth: 10
				}
			} }>
				<Button onClick={ handleIncrement } sx={ buttonSx }>+</Button>
				<Button onClick={ handleDecrement } sx={ buttonSx }>-</Button>
			</ButtonGroup>
		</Paper>
	)
}

