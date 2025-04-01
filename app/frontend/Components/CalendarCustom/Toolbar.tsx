import { DatePicker, DateValue, MonthPicker } from "@mantine/dates"
import { useDisclosure } from "@mantine/hooks"
import clsx from "clsx"
import { useMemo } from "react"

import { Box, Button, Group, Menu } from "@/Components"
import { useCalendarContext } from "@/Components/CalendarCustom"
import { CalendarLocalizer } from "@/Components/CalendarCustom/lib/localizers"
import { NAVIGATION, VIEW_NAMES, viewComponents, VIEWS } from "@/Components/CalendarCustom/Views"

import { PreviousIcon, NextIcon } from "../Icons"

interface ToolbarProps {
	views: Partial<VIEW_NAMES[]>
	view: VIEW_NAMES
}

const Toolbar = ({
	views,
	view,
}: ToolbarProps) => {
	const { date, localizer, handleViewChange, handleDateChange } = useCalendarContext()
	const [opened, { toggle, close }] = useDisclosure(false)

	const handlePickDate = (d: DateValue) => {
		close()
		if(!d) return
		handleDateChange(NAVIGATION.date, d)
	}

	const label = useMemo(() => {
		const ViewComponent = viewComponents[view]
		return ViewComponent.title(date, {
			date,
			today: new Date(),
			localizer,
			events: undefined,
		})
	}, [date, localizer, view])

	return (
		<Group justify="space-between" my="md">
			<Box component="span" className={ clsx("rbc-btn-group") }>
				<Button variant="light" onClick={ () => handleDateChange(NAVIGATION.previous) }><PreviousIcon />{ localizer.messages.navigation.previous }</Button>
				<Button variant="light" onClick={ () => handleDateChange(NAVIGATION.today) }>{ localizer.messages.navigation.today }</Button>
				<Button variant="light" onClick={ () => handleDateChange(NAVIGATION.next) }>{ localizer.messages.navigation.next }<NextIcon /></Button>
			</Box>

			<Box component="span">
				<Menu opened={ opened } onClose={ close }>
					<Menu.Target>
						<Button onClick={ toggle } variant="subtle">{ label }</Button>
					</Menu.Target>

					<Menu.Dropdown>{ view === VIEWS.month
						? <MonthPicker onChange={ handlePickDate } />
						: <DatePicker onChange={ handlePickDate } />
					}</Menu.Dropdown>
				</Menu>
			</Box>

			<Box component="span" className={ clsx("rbc-btn-group") }>
				{ Array.isArray(views) && views.map(name => {
					return (
						<Button
							key={ name }
							variant={ view === name ? "filled" : "light" }
							onClick={ () => handleViewChange(name) }
						>
							{ localizer.messages.views[name] }
						</Button>
					)
				}) }
			</Box>
		</Group>
	)
}

export default Toolbar
