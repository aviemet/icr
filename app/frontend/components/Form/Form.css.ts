import { css } from "@linaria/core"

import { vars } from "@/lib/css"

export const form = css`
`

export const fieldset = css`
`

export const dynamicFieldsRow = css`
	display: flex;
	align-items: flex-start;
	gap: ${ vars.spacing.xs };
`

export const dynamicFieldsContent = css`
	flex: 1;
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

