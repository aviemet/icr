import React, { useCallback, useMemo, useRef }  from "react"
import { router } from "@inertiajs/react"
import { buildShiftTitle, formatEventTitle, theme } from "@/lib"
import dayjs from "dayjs"
import {
	Box,
	Calendar,
	Page,
} from "@/Components"
import { type NavigateAction, type View, type Event } from "react-big-calendar"
import { modals } from "@mantine/modals"
import useStore from "@/lib/store"
import ShiftInfo from "./ShiftInfo"
import NewShiftForm from "./NewShiftForm"
import { usePageProps } from "@/lib/hooks"
import { pick } from "lodash"
import useDefaultEventOptions from "@/Components/TUICalendar/useDefaultEventOptions"
interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsShow[]
}

const Schedule = ({ client, schedules }: ScheduleProps) => {
	const defaultEventOptions = useDefaultEventOptions()
	const { getContrastingColor } = useStore()
	const { settings } = usePageProps()

	const newShiftModalRef = useRef<string>()

	const handleSelectEvent = (event: Event, e: React.SyntheticEvent<HTMLElement, globalThis.Event>) => {
		modals.open({
			title: event.resource.employee.person.name,
			children: (
				<ShiftInfo event={ event } />
			),
		})
	}

	const handleNewShiftSuccess = () => {
		if(!newShiftModalRef.current) return

		modals.close(newShiftModalRef.current)
		router.reload({ only: ["schedules"] })
	}

	const handleNewShift = (date: Date) => {
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
	}

	const handleDateChange = (newDate: Date, view: View, action: NavigateAction) => {
		// console.log({ date: params })
	}

	const handleViewChange = (view: View) => {
		// console.log({ view })
	}

	const handleRangeChange = (start: Date, end: Date, view: View) => {
		router.get(`/clients/${client.slug}/schedule`,
			{
				start: dayjs(start).format("YYYY-MM-DD"),
				end: dayjs(end).format("YYYY-MM-DD"),
				view,
			},
			{
				only: ["shifts"],
				preserveState: true,
				preserveScroll: true,
			},
		)
	}

	const eventStyleGetter = (event: Event) => {
		let defaultColor = theme.colors.blue[5]

		const eventColor = event?.resource?.backgroundColor || defaultColor

		return {
			style: {
				backgroundColor: eventColor,
				color: getContrastingColor(eventColor),
			},
		}
	}

	const handleEventTitle = useCallback((
		schedule: Schema.CalendarEventsShow,
		employee: Schema.EmployeesPersisted
	) => {
		try {
			return formatEventTitle(settings.shift_title_format, schedule.starts_at, pick(employee, ["first_name", "last_name", "full_name"]))
		// eslint-disable-next-line no-unused-vars
		} catch(e) {
			return schedule.name || buildShiftTitle({
				start: schedule.starts_at,
				end: schedule.ends_at,
				name: employee.full_name,
			})
		}
	}, [settings.shift_title_format])

	const processedSchedules = useMemo(() => {
		return schedules?.map(schedule => {
			return defaultEventOptions({
				id: schedule.id,
				title: handleEventTitle(schedule, schedule.shift.employee),
				start: schedule.starts_at,
				end: schedule.ends_at,
				backgroundColor: schedule.shift.employee.color,
				raw: {
					employee: schedule.shift.employee,
				},
			})
		}) || []
	}, [schedules, handleEventTitle, defaultEventOptions])

	console.log({ event: processedSchedules[0] })

	return (
		<Page
			title={ `${client?.person?.name} | Schedule` }
			breadcrumbs={ [
				{ title: "Clients", href: "/clients" },
				{ title: client?.person?.name, href: `/clients/${client.slug}` },
				{ title: "Schedule", href: `/clients/${client.slug}/schedule` },
			] }
		>
			<h1>{ client?.person?.name }</h1>
			<Box>
				<Calendar
					events={ processedSchedules }
					// onSelectEvent={ handleSelectEvent }
					// onSelectSlot={ handleSelectSlot }
					// onNavigate={ handleDateChange }
					// onView={ handleViewChange }
					// onRangeChange={ handleRangeChange }
					// eventPropGetter={ eventStyleGetter }
					// onNewShift={ handleNewShift }
				/>
			</Box>
		</Page>
	)
}

export default Schedule
