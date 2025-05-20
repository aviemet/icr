import { DatePicker, DateValue, MonthPicker } from "@mantine/dates"
import { useDisclosure } from "@mantine/hooks"
import clsx from "clsx"
import { forwardRef, useMemo } from "react"

import { Box, Button, Group, Menu, Paper } from "@/components"
import { FloatingIndicator } from "@/components/Button/FloatingIndicator"
import { useCalendarContext } from "@/components/Calendar"
import { NAVIGATION, VIEW_NAMES, viewComponents, VIEWS } from "@/components/Calendar/views"
import { PreviousIcon, NextIcon, DownArrowIcon } from "@/components/Icons"
import { useAnimateWidth } from "@/lib/hooks/useAnimateWidth"

import * as classes from "./Toolbar.css"


interface ToolbarProps {
	views?: readonly VIEW_NAMES[]
	view: VIEW_NAMES
}

const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>((
	{
		views = Object.values(VIEWS),
		view,
	},
	ref,
) => {
	const { date, localizer, handleViewChange, handleDateChange, resourcesById } = useCalendarContext()
	const [opened, { close, toggle }] = useDisclosure(false)

	const [wrapperRef, contentRef] = useAnimateWidth<HTMLDivElement, HTMLButtonElement>({
		speed: 100,
	})

	const handlePickDate = (d: DateValue) => {
		close()
		if(!d) return
		const dateObj = typeof d === "string" ? new Date(d) : d
		handleDateChange(NAVIGATION.date, dateObj)
	}

	const label = useMemo(() => {
		const ViewComponent = viewComponents[view]
		return ViewComponent.title(date, {
			date,
			today: new Date(),
			localizer,
			events: [],
			resourcesById,
		})
	}, [date, localizer, view, resourcesById])

	const buttonStyles = {
		py: 0,
		size: "xs",
	}

	return (
		<Group my="md" ref={ ref }>

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
								onClick={ toggle }
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
				{ views.length !== 0 && <FloatingIndicator<VIEW_NAMES>
					value={ view }
					onValueChange={ handleViewChange }
					options={
						views.map(name => ({
							key: name,
							title: localizer.messages.views[name],
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
})

export default Toolbar
