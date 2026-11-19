import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const entry = css`
	display: flex;
	align-items: flex-start;
	gap: ${ vars.spacing.xs };
	padding: ${ vars.spacing.sm } 0;
	border-bottom: 1px solid light-dark(${ vars.colors.gray[2] }, ${ vars.colors.dark[5] });

	&:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	&:first-child {
		padding-top: 0;
	}
`

export const entryBody = css`
	flex: 1 1 auto;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
`
