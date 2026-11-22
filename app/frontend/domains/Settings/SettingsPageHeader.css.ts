import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const chrome = css`
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: space-between;
	gap: ${ vars.spacing.sm };
	margin-bottom: ${ vars.spacing.md };
`

export const identity = css`
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
`

export const description = css`
	font-size: ${ vars.fontSizes.sm };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`

export const actions = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${ vars.spacing.xs };
`
