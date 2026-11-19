import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const panel = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.sm };
	min-width: 0;
`

export const header = css`
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	justify-content: space-between;
	gap: ${ vars.spacing.xs };
`

export const titleGroup = css`
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: ${ vars.spacing.xs };
`

export const count = css`
	font-size: ${ vars.fontSizes.sm };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`

export const list = css`
	display: flex;
	flex-direction: column;
	overflow: hidden;
`

export const empty = css`
	padding: ${ vars.spacing.sm } 0;
	text-align: center;
	font-size: ${ vars.fontSizes.sm };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`
