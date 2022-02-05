import React, { useState, useEffect } from 'react'
import {
	Box,
	Button,
	ButtonGroup,
	Divider,
	FormGroup,
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
	Grid,
	IconButton,
	InputAdornment,
	InputBase,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Paper,
	Select,
	Stack,
	Switch,
	TextField,
	Typography,
	useMediaQuery
} from '@mui/material'
import DaysPicker from './DaysPicker'
import DateTimePicker, { DatePicker, TimePicker } from './DateTimePicker'

const Repeats = ({ data, setData }) => {
	const [repeats, setRepeats] = useState(false)

	const pluralize = () => {
		if(data.offset && data.offset > 1) {
			return 's'
		}
	}

	useEffect(() => {
		setData({
			offset: repeats ? 1 : undefined,
			recurring_type: repeats ? 'daily' : undefined
		})
	}, [repeats])

	return (
		<>
			<Grid item xs={ 12 }>
				<FormGroup>
					<Grid container>
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
							<Grid item xs={ 3 }>
								<GroupedButtons value={ data['offset'] } onChange={ count => setData('offset', count) } min={ 1 } />
							</Grid>

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
						</> }
					</Grid>
				</FormGroup>
			</Grid>

			{ data.recurring_type === 'weekly' && <Grid item xs={ 12 }>
				<Box sx={ { mt: 2 } }>
					<DaysPicker setData={ setData } />
				</Box>
			</Grid> }
		</>
	)
}

export default Repeats

interface IGroupedButtonsProps {
	value: number
	onChange: (count: number) => void
	min?: number
	max?: number
}

const GroupedButtons = ({ value, min, max, onChange }: IGroupedButtonsProps) => {
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

