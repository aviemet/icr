import { vars, theme } from '@/lib/theme'
import { darken, lighten } from '@mantine/core'
import { css } from '@linaria/core'

const fieldsetAlphaAdjustment = 0.125

export const form = css`
`

export const fieldset = css`
`

export const dynamicInputItem = css`
	.mantine-Paper-root {
		${vars.lightSelector} {
			background-color: ${vars.colors.gray[0] }
		}

		${vars.darkSelector} {
			background-color: ${vars.colors.gray[8] }
		}
	}
`
