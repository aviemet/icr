import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const list = css`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
	gap: ${ vars.spacing.sm };
`

export const item = css`
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
`

export const fullWidth = css`
	grid-column: 1 / -1;
`

export const label = css`
	font-size: ${ vars.fontSizes.xs };
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`

export const value = css`
	font-size: ${ vars.fontSizes.sm };
	line-height: 1.4;
	word-break: break-word;
`
