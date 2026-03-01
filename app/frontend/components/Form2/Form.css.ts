import { css } from "@linaria/core"

import { vars } from "@/lib/css"

const fieldsetAlphaAdjustment = 0.125

export const form = css`
`

export const fieldset = css`
`

export const dynamicInputItem = css`
	.mantine-Paper-root {
		${ vars.lightSelector } {
			background-color: ${ vars.colors.gray[0] }
		}

		${ vars.darkSelector } {
			background-color: ${ vars.colors.gray[8] }
		}
	}
`

export const inline = css`
	display: inline-block;
	margin-left: ${ vars.spacing.xs };
	margin-right: ${ vars.spacing.xs };
`
