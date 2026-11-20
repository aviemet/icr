import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const root = css`
	display: inline-block;
	font-size: ${ vars.fontSizes.sm };
	font-weight: 500;
	margin-bottom: ${ vars.spacing.xxs };
`

export const withHint = css`
	display: flex;
	width: 100%;
	align-items: baseline;
	justify-content: space-between;
	gap: ${ vars.spacing.xs };
`

export const primary = css`
	min-width: 0;
`

export const requiredMark = css`
	margin-inline-start: 0.25em;
	color: ${ vars.colors.red[6] };
`

export const hint = css`
	min-width: 0;
	font-weight: 400;
	font-size: ${ vars.fontSizes.sm };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
	text-align: right;
`
