import { DatePicker, DateValue, MonthPicker } from "@mantine/dates"
import { useDisclosure } from "@mantine/hooks"
import clsx from "clsx"

import { Box, Button, Group, Menu } from "@/Components"

import { PreviousIcon, NextIcon } from "../Icons"

interface CustomToolbarProps<V extends string[]> {
	date: Date
	label: string
	views: V
	view: V[number]
	setView: React.Dispatch<React.SetStateAction<V[number]>>
}

const CustomToolbar = <V extends string[]>({
	date,
	label,
	views,
	view,
	setView,
}: CustomToolbarProps<V>) => {
	const [opened, { toggle, close }] = useDisclosure(false)

	const handlePickDate = (d: DateValue) => {
		close()
		if(!d) return
		// onNavigate(Navigate.DATE, d)
	}

	return (
		<Group justify="space-between" my="md">
			<Box component="span" className={ clsx("rbc-btn-group") }>
				<Button variant="light" onClick={ () => onNavigate(Navigate.PREVIOUS) }><PreviousIcon />Previous</Button>
				<Button variant="light" onClick={ () => onNavigate(Navigate.TODAY) }>Today</Button>
				<Button variant="light" onClick={ () => onNavigate(Navigate.NEXT) }>Next<NextIcon /></Button>
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

			<Box component="span" className={ clsx("rbc-btn-group") }>
				{ Array.isArray(views) && views.map(name => {
					return (
						<Button
							key={ name }
							variant={ view === name ? "filled" : "light" }
							onClick={ () => setView(name) }
						>
							{ name }
						</Button>
					)
				}) }
			</Box>
		</Group>
	)
}

export default CustomToolbar
