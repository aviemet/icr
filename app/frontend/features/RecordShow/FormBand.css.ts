import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const band = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.md };
	min-width: 0;
`

export const header = css`
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding-bottom: ${ vars.spacing.sm };
	border-bottom: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
`

export const title = css`
	font-size: ${ vars.fontSizes.xs };
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`

export const description = css`
	font-size: ${ vars.fontSizes.sm };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`

export const fields = css`
	display: block;
`

export const stack = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.md };
`
