import React from 'react'
import { Switch, Sx, type SwitchProps } from '@mantine/core'

export interface ISwitchProps extends SwitchProps {
	sx?: Sx
}

const SwitchComponent = ({ id, name, mt = 'md', sx, ...props }: ISwitchProps) => {
	const inputId = id ?? name

	return (
		<>
			<Switch
				id={ inputId }
				name={ name }
				required={ props.required }
				sx={ [{ padding: '14px 10px' }, sx] }
				mt={ mt }
				{ ...props }
			/>
		</>
	)
}

export default SwitchComponent
