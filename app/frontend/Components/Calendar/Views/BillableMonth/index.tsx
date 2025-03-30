import clsx from "clsx"
import { chunk } from "lodash"
import { useState, useRef } from "react"
import { DateLocalizer, ViewProps } from "react-big-calendar"
import DateContentRow from "react-big-calendar/lib/DateContentRow"
import Header from "react-big-calendar/lib/Header"
import { inRange, sortWeekEvents } from "react-big-calendar/lib/utils/eventLevels"


const eventsForWeek = (events: CustomMonthProps["events"], start: Date, end: Date, accessors: any, localizer: DateLocalizer) => {
	if(!Array.isArray(events)) return []

	events.filter((e) => inRange(e, start, end, accessors, localizer))
}

interface CustomMonthProps extends Omit<ViewProps, "localizer"> {
	localizer: DateLocalizer
	resizable?: boolean
	width?: number
	className?: string
}

const CustomMonth = ({
	events,
	date,
	min,
	max,
	step,
	getNow,
	scrollToTime,
	enableAutoScroll,
	rtl,
	resizable,
	width,
	accessors,
	components,
	getters,
	localizer,
	selected,
	selectable,
	longPressThreshold,
	onNavigate,
	onSelectSlot,
	onSelectEvent,
	onDoubleClickEvent,
	onKeyPressEvent,
	onShowMore,
	showAllEvents,
	doShowMoreDrillDown,
	onDrillDown,
	getDrilldownView,
	popup,
	handleDragStart,
	popupOffset,
	className,
	...props
}: CustomMonthProps) => {
	console.log({ props })

	const [rowLimit, setRowLimit] = useState(5)
	const [needLimitMeasure, setNeedLimitMeasure] = useState(localizer.neq(date, date, "month"))

	const containerRef = useRef<HTMLDivElement>(null)
	const slotRowRef = useRef<HTMLDivElement>(null)

	const bgRows = []
	const pendingSelection = []

	const month = localizer.visibleDays(date, localizer)
	const weeks = chunk(month, 7)

	let HeaderComponent = components.header || Header

	return (
		<div
			className={ clsx("rbc-month-view", className) }
			role="table"
			aria-label="Month View"
			ref={ containerRef }
		>
			<div className="rbc-row rbc-month-header" role="row">
				{ localizer.range(weeks[0][0], weeks[0][weeks[0].length - 1], "day").map((day: Date, index: number) => (
					<div key={ "header_" + index } className="rbc-header">
						<HeaderComponent
							date={ day }
							localizer={ localizer }
							label={ localizer.format(day, "weekdayFormat") }
						/>
					</div>
				)) }
			</div>
			{ weeks.map((week, weekIdx) => {
				const weeksEvents = eventsForWeek(
					events,
					week[0],
					week[week.length - 1],
					accessors,
					localizer
				)

				const sorted = sortWeekEvents(weeksEvents, accessors, localizer)

				return (
					<DateContentRow
						key={ weekIdx }
						ref={ weekIdx === 0 ? slotRowRef : undefined }
						container={ containerRef.current }
						className={ clsx("rbc-month-row") }
						getNow={ getNow }
						date={ date }
						range={ week }
						events={ sorted }
						maxRows={ showAllEvents ? Infinity : rowLimit }
						selected={ selected }
						selectable={ selectable }
						components={ components }
						accessors={ accessors }
						getters={ getters }
						localizer={ localizer }
						renderHeader={ readerDateHeading }
						renderForMeasure={ needLimitMeasure }
						onShowMore={ handleShowMore }
						onSelect={ handleSelectEvent }
						onDoubleClick={ handleDoubleClickEvent }
						onKeyPress={ handleKeyPressEvent }
						onSelectSlot={ handleSelectSlot }
						longPressThreshold={ longPressThreshold }
						rtl={ props.rtl }
						resizable={ props.resizable }
						showAllEvents={ showAllEvents }
					/>
				)
			}) }
			{ props.popup && renderOverlay() }
		</div>
	)
}

export default CustomMonth

