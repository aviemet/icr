import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const desk = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.md };
`

export const hero = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: ${ vars.spacing.sm };
`

export const meta = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${ vars.spacing.xs };
	margin-top: ${ vars.spacing.xs };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
	font-size: ${ vars.fontSizes.sm };
`

export const picker = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
	max-width: 22rem;
`
