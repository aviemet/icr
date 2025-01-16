import { IconButton } from "@/Components"
import { ActionIconProps } from "@mantine/core"

import cx from "clsx"
import * as classes from "./Calendar.css"
import { PlusIcon } from "../Icons"

export type NewShiftClick = (date: Date) => void

interface NewShiftButtonProps extends ActionIconProps,
	Omit<React.ComponentPropsWithoutRef<"button">, keyof ActionIconProps | "onClick"> {
	date: Date
	onClick?: NewShiftClick
}

const NewShiftButton = ({
	className,
	date,
	onClick,
	variant = "subtle",
	...props
}: NewShiftButtonProps) => {
	const handleClick = () => {
		onClick?.(date)
	}

	return (
		<IconButton
			{ ...props }
			variant={ variant }
			onClick={ handleClick }
			className={ cx(className, classes.newShiftButton) }
			size="xs"
		>
			<PlusIcon />
		</IconButton>
	)
}

export default NewShiftButton
