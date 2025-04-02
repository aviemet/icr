import { DatePicker, DateValue, MonthPicker } from "@mantine/dates"
import { useDisclosure } from "@mantine/hooks"
import clsx from "clsx"
import { useMemo } from "react"

import { Box, Button, Group, Menu, Paper } from "@/Components"
import { FloatingIndicator } from "@/Components/Button/FloatingIndicator"
import { useCalendarContext } from "@/Components/CalendarCustom"
import { NAVIGATION, VIEW_NAMES, viewComponents, VIEWS } from "@/Components/CalendarCustom/Views"
import { PreviousIcon, NextIcon, DownArrowIcon } from "@/Components/Icons"

import * as classes from "./Toolbar.css"

interface ToolbarProps {
	views: readonly VIEW_NAMES[]
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

	const buttonStyles = {
		py: 0,
		size: "xs",
	}

	return (
		<Group justify="space-between" my="md">

			{ /* Time navigation buttons */ }
			<Paper className={ clsx(classes.buttonsContainer) }>

				<Button
					onClick={ () => handleDateChange(NAVIGATION.previous) }
					variant="subtle"
					mx="xxs"
					{ ...buttonStyles }
				>
					<PreviousIcon />{ localizer.messages.navigation.previous }
				</Button>

				<Button
					onClick={ () => handleDateChange(NAVIGATION.today) }
					variant={ localizer.dateWithinRange(view, date) ? "filled" : "subtle" }
					{ ...buttonStyles }
				>
					{ localizer.messages.navigation.today }
				</Button>

				<Button
					onClick={ () => handleDateChange(NAVIGATION.next) }
					variant="subtle"
					mx="xxs"
					{ ...buttonStyles }
				>
					{ localizer.messages.navigation.next }<NextIcon />
				</Button>

			</Paper>

			{ /* Title and date navigation dropdown */ }
			<Paper className={ clsx(classes.buttonsContainer) }>
				<Menu opened={ opened } onClose={ close } >
					<Menu.Target>
						<Button
							onClick={ toggle }
							variant="subtle"
							rightSection={
								<Box className={ clsx(classes.datePickerMenu, { opened }) }>
									<DownArrowIcon size={ 16 } />
								</Box>
							}
							{ ...buttonStyles }
						>
							{ label }
						</Button>
					</Menu.Target>

					<Menu.Dropdown>{ view === VIEWS.month
						? <MonthPicker onChange={ handlePickDate } />
						: <DatePicker onChange={ handlePickDate } />
					}</Menu.Dropdown>
				</Menu>
			</Paper>

			{ /* Calendar view buttons */ }
			{ views.length !== 0 && <FloatingIndicator
				options={
					views.map(name => ({
						key: name,
						title: localizer.messages.views[name],
						onClick: () => handleViewChange(name),
					}))
				}
				buttonProps={ {
					size: "xs",
					py: "xxs",
					mx: "xxs",
				} }
			/> }

		</Group>
	)
}

export default Toolbar
