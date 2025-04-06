import { useCalendarContext } from "@/Components/Calendar"

import * as classes from "../TimeGrid.css"

interface TimeColumnProps {
	timeSlots: Date[]
}

const TimeColumn = ({
	timeSlots,
}: TimeColumnProps) => {
	const { localizer } = useCalendarContext()

	return (
		<div className={ classes.timeColumn }>
			{ timeSlots.map((time) => (
				<div key={ time.toISOString() } className={ classes.timeSlot }>
					{ localizer.format(time, "h:mm a") }
				</div>
			)) }
		</div>
	)
}

export default TimeColumn
