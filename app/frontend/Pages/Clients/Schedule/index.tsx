import { useCallback, useMemo, useState } from "react"

import {
	Box,
	Calendar,
	Group,
} from "@/Components"
import { NAVIGATION_ACTION, VIEW_NAMES, VIEWS } from "@/Components/Calendar/Views"
import { DisplayStrategy } from "@/Components/Calendar/Views/Month/displayStrategies"
import { Select } from "@/Components/Inputs"
import { buildShiftTitle, formatEventTitle } from "@/lib"
import { usePageProps } from "@/lib/hooks"
import { initials } from "@/lib/strings"
import { useGetClientSchedules } from "@/queries/clients"

// import NewShiftForm from "./NewShiftForm"

interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsShow[]
}

// Ensure a value is a Date object
const ensureDate = (value: unknown): Date => {
	if(value instanceof Date) return value
	if(typeof value === "string" || typeof value === "number") return new Date(value)
	return new Date() // Fallback
}

const Schedule = ({ client, schedules: initialSchedules }: ScheduleProps) => {
	const { settings } = usePageProps()
	const [displayStrategy, setDisplayStrategy] = useState<DisplayStrategy>("split")

	const [queryParams, setQueryParams] = useState<{ date: Date, view: VIEW_NAMES }>({
		date: new Date(),
		view: VIEWS.month,
	})

	// Use React Query to fetch schedules with the initial data from Inertia
	const { data } = useGetClientSchedules({ slug: client.slug, ...queryParams }, {
		initialData: initialSchedules,
		refetchOnWindowFocus: false,
	})

	const handleNavigate = useCallback((newDate: Date, action: NAVIGATION_ACTION, view: VIEW_NAMES) => {
		setQueryParams({
			date: newDate,
			view: view,
		})
	}, [])

	const handleEventTitle = useCallback((
		schedule: Schema.CalendarEventsShow,
		employee: Schema.EmployeesPersisted,
		displayStart?: Date,
		displayEnd?: Date
	) => {
		try {
			const templateVars = {
				first_name: employee.first_name,
				last_name: employee.last_name,
				full_name: employee.full_name,
				first_initial: initials(employee.first_name),
				last_initial: initials(employee.last_name),
			}

			// Ensure dates are Date objects
			const start = displayStart ? ensureDate(displayStart) : ensureDate(schedule.starts_at)
			const end = displayEnd ? ensureDate(displayEnd) : ensureDate(schedule.ends_at)

			return formatEventTitle(
				settings.shift_title_format,
				start,
				end,
				templateVars
			)
		// eslint-disable-next-line no-unused-vars
		} catch(e) {
			// Ensure dates are Date objects even in the error case
			const start = displayStart ? ensureDate(displayStart) : ensureDate(schedule.starts_at)
			const end = displayEnd ? ensureDate(displayEnd) : ensureDate(schedule.ends_at)

			return schedule.name || buildShiftTitle({
				start,
				end,
				name: employee.full_name,
			})
		}
	}, [settings.shift_title_format])

	const processedSchedules = useMemo(() => {
		return data?.map(schedule => {
			// Ensure dates are proper Date objects
			const start = ensureDate(schedule.starts_at)
			const end = ensureDate(schedule.ends_at)

			return {
				id: schedule.id,
				title: handleEventTitle(schedule, schedule.shift.employee),
				start,
				end,
				color: schedule.shift.employee.color,
				getTitleWithDisplayTimes: (displayStart?: Date, displayEnd?: Date) => {
					// Ensure displayStart and displayEnd are Date objects
					const dsDate = displayStart ? ensureDate(displayStart) : undefined
					const deDate = displayEnd ? ensureDate(displayEnd) : undefined
					return handleEventTitle(schedule, schedule.shift.employee, dsDate, deDate)
				},
			}
		}) || []
	}, [data, handleEventTitle])

	return (
		<>
			<Group justify="space-between">
				<h1>{ client?.person?.name }</h1>
				<Box>
					<Select
						options={ [
							{ value: "stack", label: "Stack" },
							{ value: "span", label: "Span" },
							{ value: "split", label: "Split" },
						] as { value: DisplayStrategy, label: string }[] }
						value={ displayStrategy }
						onChange={ (value: string | null) => {
							if(value && (value === "stack" || value === "span" || value === "split")) {
								setDisplayStrategy(value)
							}
						} }
					/>
				</Box>
			</Group>
			<Calendar
				defaultDate={ new Date() }
				defaultView="month"
				events={ processedSchedules }
				displayStrategy={ displayStrategy }
				onNavigate={ handleNavigate }
				// onSelectEvent={ handleSelectEvent }
				// onSelectSlot={ handleSelectSlot }
				// onView={ handleViewChange }
				// onRangeChange={ handleRangeChange }
				// eventPropGetter={ eventStyleGetter }
				// onNewShift={ handleNewShift }
			/>
		</>
	)
}

export default Schedule

/* TODO: We'll get to the new shift button eventually
	const handleNewShift = useCallback((date: Date) => {
		newShiftModalRef.current = modals.open({
			title: "New Shift",
			children: (
				<NewShiftForm
					client={ client }
					selectedDate={ date }
					onSuccess={ handleNewShiftSuccess }
				/>
			),
		})
	}, [client, handleNewShiftSuccess])
	*/
