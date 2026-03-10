import { Box, type BoxProps } from "@mantine/core"
import clsx from "clsx"

interface LabelProps
	extends BoxProps,
	Omit<React.ComponentPropsWithRef<"label">, keyof BoxProps>
{
	required?: boolean
}

export function Label({ children, required = false, className, ...props }: LabelProps) {
	return (
		<Box
			component="label"
			className={ clsx(className, { required }) }
			{ ...props }
		>
			{ children }
		</Box>
	)
}
