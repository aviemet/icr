import { ActionIconProps } from "@mantine/core"
import clsx from "clsx"
import React from "react"

import { IconButton } from "@/Components"

import { PlusIcon } from "../Icons"
import * as classes from "./Calendar.css"

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
			className={ clsx(className, classes.newShiftButton) }
			size="xs"
		>
			<PlusIcon />
		</IconButton>
	)
}

export default React.memo(NewShiftButton)
