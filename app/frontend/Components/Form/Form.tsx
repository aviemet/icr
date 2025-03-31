import { Box } from "@mantine/core"
import clsx from "clsx"
import {
	Form as InertiaForm,
	type FormProps as UifFormProps,
	type NestedObject,
} from "use-inertia-form"

import * as classes from "./Form.css"

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
		<Box className={ clsx(classes.form) }>
			<InertiaForm
				data={ data }
				className={ clsx(className) }
				railsAttributes={ railsAttributes }
				{ ...props }
			>
				{ children }
			</InertiaForm>
		</Box>
	)
}

export default Form
