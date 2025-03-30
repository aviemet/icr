import { useMantineTheme } from "@mantine/core"
import { Options } from "@toast-ui/calendar"
import { useCallback } from "react"

export const useDefaultCalendarOptions = () => {
	const theme = useMantineTheme()

	const defaultCalendarOptions = useCallback((options: Options): Options => ({
		usageStatistics: false,
		defaultView: "month",
		useDetailPopup: false,
		useFormPopup: false,
		theme: {
			common: {
				backgroundColor: false,
				border: false,
				gridSelection: {
					backgroundColor: false,
					border: false,
				},
				dayName: false,
				holiday: false,
				saturday: false,
				today: false,
			},
			month: {
				dayExceptThisMonth: {
					color: false,
				},
				dayName: {
					backgroundColor: false,
					borderLeft: false,
				},
				holidayExceptThisMonth: {
					color: false,
				},
				moreView: {
					backgroundColor: false,
					border: false,
					boxShadow: false,
					width: null,
					height: null,
				},
				moreViewTitle: {
					backgroundColor: false,
				},
				weekend: {
					backgroundColor: false,
				},
			},
			week: {
				dayName: {
					backgroundColor: false,
					borderLeft: false,
					borderTop: false,
					borderBottom: false,
				},
				dayGrid: {
					borderRight: false,
					backgroundColor: false,
				},
				dayGridLeft: {
					borderRight: false,
					backgroundColor: false,
					width: "auto",
				},
				timeGrid: {
					borderRight: false,
				},
				timeGridLeft: {
					backgroundColor: false,
					borderRight: false,
					width: "auto",
				},
				timeGridLeftAdditionalTimezone: {
					backgroundColor: false,
				},
				timeGridHalfHour: {
					borderBottom: false,
				},
				nowIndicatorLabel: {
					color: false,
				},
				nowIndicatorPast: {
					border: false,
				},
				nowIndicatorBullet: {
					backgroundColor: false,
				},
				nowIndicatorToday: {
					border: false,
				},
				nowIndicatorFuture: {
					border: false,
				},
				pastTime: {
					color: false,
				},
				futureTime: {
					color: false,
				},
				weekend: {
					backgroundColor: false,
				},
				today: {
					color: false,
					backgroundColor: false,
				},
				pastDay: {
					color: false,
				},
				panelResizer: {
					border: false,
				},
				gridSelection: {
					color: false,
				},
			},
		},
		...options,
	}), [theme])

	return defaultCalendarOptions
}
