import React from 'react'
import { Box } from '@mantine/core'
import {
	Form as InertiaForm,
	type FormProps as UifFormProps,
	type NestedObject,
} from 'use-inertia-form'

import cx from 'clsx'
import * as classes from './Form.css'

export interface FormProps<TForm> extends UifFormProps<TForm> {
	disableFormatting?: boolean
}

const Form = <TForm extends NestedObject>({
	children,
	data,
	className,
	railsAttributes = true,
	...props
}: FormProps<TForm>) => {
	return (
		<Box className={ cx(classes.form) }>
			<InertiaForm
				data={ data }
				className={ cx(className) }
				railsAttributes={ railsAttributes }
				{ ...props }
			>
				{ children }
			</InertiaForm>
		</Box>
	)
}

export default Form
