import {
	DayPilot,
	DayPilotCalendar,
	DayPilotMonth,
	DayPilotNavigator,
} from "@daypilot/daypilot-lite-react"
import React, { useMemo, useState } from "react"
import "./Calendar.css"

interface CalendarProps {
	events: DayPilot.EventData[]
}

const Calendar = ({ events }: CalendarProps) => {
	const [view, setView] = useState<"Day" | "Week" | "Month">("Month")
	const [startDate, setStartDate] = useState(DayPilot.Date.today())

	const [dayView, setDayView] = useState()
	const [weekView, setWeekView] = useState()
	const [monthView, setMonthView] = useState()

	const onTimeRangeSelected = async (args) => {
		const dp = args.control
		const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1")
		dp.clearSelection()
		if(modal.canceled) {
			return
		}
		const e = {
			start: args.start,
			end: args.end,
			text: modal.result,
		}
		// setEvents([...events, e])
	}

	const processedSchedules = useMemo(() => {
		return events?.map(schedule => {
			return {
				id: schedule.id,
				text: schedule.shift.employee.name,
				start: schedule.starts_at,
				end: schedule.ends_at,
				backColor: schedule.shift.employee.color,
				borderColor: "darker",
			}
		}) || []
	}, [])
	console.log({ processedSchedules })
	return (
		<div className={ "container" }>
			{ /*
			 */ }
			<div className={ "content" }>
				<div className={ "toolbar" }>
					<div className={ "toolbar-group" }>
						<button onClick={ () => setView("Day") } className={ view === "Day" ? "selected" : "" }>Day</button>
						<button onClick={ () => setView("Week") } className={ view === "Week" ? "selected" : "" }>Week</button>
						<button onClick={ () => setView("Month") } className={ view === "Month" ? "selected" : "" }>Month</button>
					</div>
					<button onClick={ () => setStartDate(DayPilot.Date.today()) } className={ "standalone" }>Today</button>
				</div>

				<DayPilotCalendar
					viewType={ "Day" }
					startDate={ startDate }
					events={ processedSchedules }
					visible={ view === "Day" }
					durationBarVisible={ false }
					controlRef={ setDayView }
				/>
				<DayPilotCalendar
					viewType={ "Week" }
					startDate={ startDate }
					events={ processedSchedules }
					visible={ view === "Week" }
					durationBarVisible={ false }
					controlRef={ setWeekView }
				/>
				<DayPilotMonth
					startDate={ startDate }
					events={ processedSchedules }
					visible={ view === "Month" }
					eventBarVisible={ false }
					controlRef={ setMonthView }
				/>
			</div>
		</div>
	)
}
export default Calendar
