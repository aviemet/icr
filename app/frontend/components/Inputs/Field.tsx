import { Box, type BoxProps } from "@mantine/core"
import clsx from "clsx"

import { type InputType } from "@/types"

export interface FieldProps extends BoxProps {
	children: React.ReactNode
	type?: InputType
	required?: boolean
	errors?: boolean
	inline?: boolean
}

export function Field({
	children,
	type,
	required = false,
	errors = false,
	className,
	inline = false,
	...props
}: FieldProps) {
	return (
		<Box
			className={ clsx(
				"field",
				{ [String(type)]: type },
				{ "required": required },
				{ "field_with_errors": errors },
				className,
			) }
			{ ...props }
		>
			{ children }
		</Box>
	)
}
