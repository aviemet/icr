import { Box, type BoxProps } from "@mantine/core"
import clsx from "clsx"

import * as classes from "./Label.css"

interface LabelProps extends
	BoxProps,
	Omit<React.ComponentPropsWithoutRef<"label">, keyof BoxProps> {
	required?: boolean
	hint?: React.ReactNode
}

export function Label({
	children,
	required = false,
	hint,
	className,
	...props
}: LabelProps) {
	return (
		<Box
			component="label"
			className={ clsx(
				classes.root,
				{ [classes.withHint]: hint !== undefined && hint !== null && hint !== "" },
				className,
			) }
			{ ...props }
		>
			<span className={ classes.primary }>
				{ children }
				{ required && (
					<span className={ classes.requiredMark } aria-hidden="true">*</span>
				) }
			</span>
			{ hint !== undefined && hint !== null && hint !== "" && (
				<span className={ classes.hint }>{ hint }</span>
			) }
		</Box>
	)
}
