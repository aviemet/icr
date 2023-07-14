import { createStyles } from '@mantine/core'

const calendarStyles = createStyles(theme => {
	if(theme.colorScheme === 'dark') {
		return {
			calendar: {
				'.rbc-toolbar': {
					'button': {
						color: theme.white,
						'&.rbc-active': {
							backgroundColor: theme.fn.primaryColor(),
						},
					},
				},

				'.rbc-off-range-bg': {
					backgroundColor: theme.colors.gray[9],
				},

				'.rbc-today': {
					backgroundColor: theme.colors.gray[8],
				},

				'.rbc-day-bg + .rbc-day-bg': {
					borderLeft: `1px solid ${theme.colors.gray[9]}`,
				},
			},
		}
	}

	return { calendar: {} }
})

export default calendarStyles
