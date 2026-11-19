import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const header = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: ${ vars.spacing.xs };
	margin-bottom: ${ vars.spacing.sm };
`

export const title = css`
	font-size: ${ vars.fontSizes.md };
	font-weight: 600;
	line-height: 1.3;
`
