import React, { forwardRef, useState } from 'react'
import HiddenInput from './HiddenInput'
import SwatchPicker from '../SwatchPicker'
import Label from './Label'
import { InputProps } from 'react-html-props'

export interface ISwatchInputProps extends Omit<InputProps, 'onChange'> {
	label?: React.ReactNode
	initialValue?: string
	onChange?: (color: string) => void
}

const SwatchInput = forwardRef<HTMLInputElement, ISwatchInputProps>((
	{ label, id, name, required, initialValue, onChange, ...props },
	ref,
) => {
	const [color, setColor] = useState(initialValue || '')

	const handleChange = (color: string) => {
		setColor(color)

		if(onChange) onChange(color)
	}

	const inputId = id || name

	return (
		<>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<HiddenInput value={ color } id={ inputId } name={ name } { ...props } ref={ ref } />
			<SwatchPicker value={ color } onChange={ handleChange } />
		</>
	)
})

export default SwatchInput
