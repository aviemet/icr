import { Navigate, ToolbarProps } from "react-big-calendar"
import { Box, Button, Group, Menu } from "@/Components"
import { DatePicker, DateValue, MonthPicker } from "@mantine/dates"
import { PreviousIcon, NextIcon } from "../Icons"
import { useDisclosure } from "@mantine/hooks"

import cx from "clsx"

const CustomToolbar = ({
	date,
	label,
	localizer,
	onNavigate,
	onView,
	view,
	views,
}: ToolbarProps) => {
	const [opened, { toggle, close }] = useDisclosure(false)

	const handlePickDate = (d: DateValue) => {
		close()
		if(!d) return
		onNavigate(Navigate.DATE, d)
	}

	return (
		<Group justify="space-between" my="md">
			<Box component="span" className={ cx("rbc-btn-group") }>
				<Button variant="light" onClick={ () => onNavigate(Navigate.PREVIOUS) }><PreviousIcon />{ localizer.messages.previous }</Button>
				<Button variant="light" onClick={ () => onNavigate(Navigate.TODAY) }>{ localizer.messages.today }</Button>
				<Button variant="light" onClick={ () => onNavigate(Navigate.NEXT) }>{ localizer.messages.next }<NextIcon /></Button>
			</Box>

			<Box component="span">
				<Menu opened={ opened } onClose={ toggle }>
					<Menu.Target>
						<Button onClick={ toggle } variant="subtle">{ label }</Button>
					</Menu.Target>

					<Menu.Dropdown>{ view === "month"
						? <MonthPicker onChange={ handlePickDate } />
						: <DatePicker onChange={ handlePickDate } />
					}</Menu.Dropdown>
				</Menu>
			</Box>

			<Box component="span" className={ cx("rbc-btn-group") }>
				{ Array.isArray(views) && views.map(name => {
					return (
						<Button
							key={ name }
							variant={ view === name ? "filled" : "light" }
							onClick={ () => onView(name) }
						>
							{ localizer.messages[name] }
						</Button>
					)
				}) }
			</Box>
		</Group>
	)
}

export default CustomToolbar
