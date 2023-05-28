import { createStyles } from '@mantine/core'

export default createStyles((theme) => ({
	menuItem: {
		'&.disabled *': {
			color: theme.colors.gray[theme.fn.primaryShade()],
			textDecoration: 'line-through',

			'& input[type=checkbox], & input[type=checkbox]:checked': {
				backgroundColor: theme.colors.gray[theme.fn.primaryShade()],
			},
		},
	},
}))
