import { Box, type BoxProps } from "@mantine/core"
import clsx from "clsx"

interface LabelProps
	extends BoxProps,
	Omit<React.ComponentPropsWithRef<"label">, keyof BoxProps>
{
	required?: boolean
}

const Label = ({ children, required = false, className, ...props }: LabelProps) => (
	<Box
		component="label"
		className={ clsx(className, { required }) }
		{ ...props }
	>
		{ children }
	</Box>
)

export default Label
