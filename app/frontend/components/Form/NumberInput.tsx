import React, { useState, useEffect } from 'react'
import {
	Button,
	ButtonGroup,
	InputBase,
	Paper,
} from '@mui/material'
import { useForm } from './Form'

interface INumberInputProps {
	name: string
	value?: number
	onChange: (count: number) => void
	min?: number
	max?: number
}

const NumberInput = ({ name, min, max, onChange }: INumberInputProps) => {
	const { data, setData, errors } = useForm()

	const [value, setValue] = useState(data[name])

	/**
	 * On component load, ensure max and min constraints are honored, and enforce
	 * constraints on input values
	 */
	useEffect(() => {
		if(min !== undefined && max !== undefined && min >= max) {
			return console.error('Minumum value must be less than maximum value')
		}
		updateValue(data[name])
	}, [])

	/**
	 * Keep local state in sync with form data state
	 */
	useEffect(() => {
		setValue(data[name])
	}, [data[name]])

	/**
	 * By keeping input value in local state and only setting value on blur event,
	 * we allow the input to have invalid characters during user interaction. This
	 * prevents an unpleasant experience where the user's input is highjacked by
	 * overzealous formating.
	 */
	const handleBlur = e => {
		if(onChange) onChange(e.target.value)
		updateValue(e.target.value)
	}

	const updateValue = n => {
		if(min !== undefined && n < min) n = min
		if(max !== undefined && n > max) n = max

		if(n === value && n === data[name]) return

		setValue(n)
		setData(name, n)
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
				value={ value }
				onChange={ e => setValue(e.target.value) }
				onBlur={ handleBlur }
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
				<Button onClick={ () => updateValue(data[name] + 1) } sx={ buttonSx }>+</Button>
				<Button onClick={ () => updateValue(data[name] - 1) } sx={ buttonSx }>-</Button>
			</ButtonGroup>
		</Paper>
	)
}

export default NumberInput
