import { useMemo } from "react"

import { useCalendarContext } from "@/components/Calendar"

import * as classes from "../TimeGrid.css"

export interface TimeColumnProps {
	start: Date
	end: Date
	increment: number
}

export function TimeColumn({
	start,
	end,
	increment,
}: TimeColumnProps) {
	const { localizer } = useCalendarContext()

	const timeSlots = useMemo(() => {
		const slots: Date[] = []

		let current = localizer.startOf(start, "hour")
		const boundaryTime = localizer.add(localizer.startOf(end, "hour"), 1, "hour")

		while(localizer.isBefore(current, boundaryTime)) {
			slots.push(current)
			current = localizer.add(current, increment, "minute")
		}

		return slots
	}, [start, end, increment, localizer])

	return (
		<div className={ classes.timeColumn }>
			{ timeSlots.map((time) => (
				<div key={ time.toISOString() } className={ classes.timeSlot }>
					<span>
						{ localizer.format(time, `h${time.getMinutes() === 0 ? "" : ":mm "} A`) }
					</span>
				</div>
			)) }
		</div>
	)
}
