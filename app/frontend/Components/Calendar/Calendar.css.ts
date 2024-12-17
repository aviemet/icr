import { vars } from '@/lib/theme'
import { css } from '@linaria/core'

export const calendar = css`
	height: 90vh;

	${vars.darkSelector} { 
		.rbc-day-bg.rbc-today {
			background-color: ${vars.colors.cyan[9]};
		}

		.rbc-day-bg.rbc-off-range-bg {
			background-color: ${vars.colors.dark[5]};
		}

		button{
			color: ${vars.colors.white};

			&.rbc-active {
				background-color: ${vars.colors.cyan[8]};
			}
		}
	}
`
