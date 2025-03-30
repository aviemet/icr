import { Box, type BoxProps } from "@mantine/core"
import clsx from "clsx"
import { LabelProps } from "react-html-props"

interface ILabelProps extends BoxProps, Omit<LabelProps, "ref"> {
	required?: boolean
}

const Label = ({ children, required = false, className, ...props }: ILabelProps) => {
	return (
		<Box component="label" className={ clsx(className, { required }) } { ...props }>
			{ children }
		</Box>
	)
}

export default Label
