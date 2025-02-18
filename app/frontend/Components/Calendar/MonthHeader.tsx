import React from "react"
import { type HeaderProps } from "react-big-calendar"
import { Box } from "@/Components"

const MonthHeader = ({ date, label, localizer }: HeaderProps) => {
	return (
		<Box>{ label }</Box>
	)
}

export default React.memo(MonthHeader)
