import { css } from "@linaria/core"

import { vars } from "@/lib/css"

export const dynamicFieldsRow = css`
	display: flex;
	align-items: flex-start;
	gap: ${ vars.spacing.xs };
`

export const dynamicFieldsContent = css`
	flex: 1;
`

