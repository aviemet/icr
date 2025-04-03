import { DatePicker, DateValue, MonthPicker } from "@mantine/dates"
import { useDisclosure } from "@mantine/hooks"
import clsx from "clsx"
import { useMemo } from "react"

import { Box, Button, Group, Menu, Paper } from "@/Components"
import { FloatingIndicator } from "@/Components/Button/FloatingIndicator"
import { useCalendarContext } from "@/Components/Calendar"
import { NAVIGATION, VIEW_NAMES, viewComponents, VIEWS } from "@/Components/Calendar/Views"
import { PreviousIcon, NextIcon, DownArrowIcon } from "@/Components/Icons"
import { useAnimateWidth } from "@/lib/hooks/useAnimateWidth"

import * as classes from "./Toolbar.css"


interface ToolbarProps {
	views?: readonly VIEW_NAMES[]
	view: VIEW_NAMES
}

const Toolbar = ({
	views = Object.values(VIEWS),
	view,
}: ToolbarProps) => {
	const { date, localizer, handleViewChange, handleDateChange } = useCalendarContext()
	const [opened, { close }] = useDisclosure(false)

	const [wrapperRef, contentRef] = useAnimateWidth<HTMLDivElement, HTMLButtonElement>({
		speed: 100,
	})

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
		<Group my="md">

			<Box className={ clsx(classes.leftSection) }>
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
			</Box>

			{ /* Title and date navigation dropdown */ }
			<Paper className={ clsx(classes.buttonsContainer, classes.centerSection) }>
				<div ref={ wrapperRef }>
					<Menu opened={ opened } onClose={ close }>
						<Menu.Target>
							<Button
								ref={ contentRef }
								variant="subtle"
								className={ clsx(classes.dateButton) }
								rightSection={
									<Box className={ clsx(classes.datePickerMenu, { opened }) }>
										<DownArrowIcon size={ 16 } />
									</Box>
								}
								{ ...buttonStyles }
							>
								<span >
									{ label }
								</span>
							</Button>
						</Menu.Target>

						<Menu.Dropdown>{ view === VIEWS.month
							? <MonthPicker onChange={ handlePickDate } />
							: <DatePicker onChange={ handlePickDate } />
						}</Menu.Dropdown>
					</Menu>
				</div>
			</Paper>

			{ /* Calendar view buttons */ }
			<Box className={ clsx(classes.rightSection) }>
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
			</Box>
		</Group>
	)
}

export default Toolbar
