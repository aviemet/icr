import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const table = css`
	.actionsCell {
		width: 10rem;
	}
`

export const colorSwatch = css`
	width: 1rem;
	height: 1rem;
	border-radius: ${ vars.radius.sm };
	border: 1px solid ${ vars.colors.gray[4] };
	flex-shrink: 0;
`

export const flagList = css`
	display: flex;
	flex-wrap: wrap;
	gap: ${ vars.spacing.xs };
`
