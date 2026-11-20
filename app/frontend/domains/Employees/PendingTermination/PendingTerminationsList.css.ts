import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const list = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
`

export const row = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${ vars.spacing.sm };
`

export const meta = css`
	display: flex;
	min-width: 0;
	flex-direction: column;
	gap: 0.15rem;
`
