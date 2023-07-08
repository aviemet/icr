import React from 'react'
import { Radio, RadioGroupProps } from '@mantine/core'

export interface IRadioInputProps extends Omit<RadioGroupProps, 'children'> {
	options: { label: string, value: string }[]
}

const RadioInput = ({
	options,
	mt = 'md',
	...props
}: IRadioInputProps) => {
	return (
		<Radio.Group mt={ mt } { ...props }>
			{ options.map(option => (
				<Radio
					mt="md"
					key={ option.value }
					value={ option.value }
					label={ option.label }
				/>
			)) }
		</Radio.Group>
	)
}

export default RadioInput
