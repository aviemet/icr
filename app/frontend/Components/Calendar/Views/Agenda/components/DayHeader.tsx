import clsx from "clsx"

import { Text } from "@/Components"
import useStickySentinel from "@/lib/hooks/useStickySentinel"

import * as classes from "../AgendaView.css"

interface DayHeaderProps {
	children: React.ReactNode
}

export const DayHeader = ({ children }: DayHeaderProps) => {
	const [headerRef, isStuck] = useStickySentinel<HTMLDivElement>()

	return (
		<Text ref={ headerRef } className={ clsx(classes.dayHeader, {
			unstuck: isStuck,
		}) }>
			{ children }
		</Text>
	)
}
