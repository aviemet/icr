import React from 'react'
import { Box } from '@mantine/core'
import { Form as InertiaForm, type FormProps, type NestedObject } from 'use-inertia-form'
import useFormStyles from './useFormStyles'

export interface IFormProps<TForm> extends FormProps<TForm> {
	grid?: boolean
}

const Form = <TForm extends NestedObject>({
	children,
	data,
	railsAttributes = true,
	...props
}: IFormProps<TForm>) => {
	const { classes } = useFormStyles()

	return (
		<Box className={ classes.form } px="xs" pt="xs">
			<InertiaForm
				data={ data }
				railsAttributes={ railsAttributes }
				{ ...props }
			>
				{ children }
			</InertiaForm>
		</Box>
	)
}

export default Form
