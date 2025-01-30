import { Box, BoxProps } from "@mantine/core"
import { type InputType } from "@/types"

import cx from "clsx"
import * as classes from "../Form.css"

export interface FieldProps extends BoxProps {
	children: React.ReactNode
	type?: InputType
	required?: boolean
	errors?: boolean
	inline?: boolean
}

const Field = ({
	children,
	type,
	required = false,
	errors = false,
	className,
	inline = false,
	...props
}: FieldProps) => {
	return (
		<Box
			className={ cx(
				"field",
				{ [String(type)]: type },
				{ "required": required },
				{ "field_with_errors": errors },
				{ [classes.inline]: inline },
				className,
			) }
			{ ...props }
		>
			{ children }
		</Box>
	)
}

export default Field
