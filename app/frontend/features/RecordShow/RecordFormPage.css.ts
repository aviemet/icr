import { css } from "@linaria/core"

import { theme, vars } from "@/lib/theme"

export const page = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.lg };
	width: 100%;
	max-width: ${ theme.other.page.maxWidth };
	margin-inline: auto;
`

export const header = css`
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: space-between;
	gap: ${ vars.spacing.md };
	box-shadow:
		inset 3px 0 0 0 ${ vars.colors.primaryColors.filled },
		light-dark(
			0 1px 2px color-mix(in srgb, ${ vars.colors.dark[9] } 6%, transparent),
			0 1px 3px color-mix(in srgb, ${ vars.colors.black } 40%, transparent)
		);
`

export const identity = css`
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-width: 0;
`

export const identityRow = css`
	display: flex;
	align-items: center;
	gap: ${ vars.spacing.sm };
	min-width: 0;
`

export const description = css`
	font-size: ${ vars.fontSizes.sm };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[0] });
`

export const actions = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${ vars.spacing.sm };
`

export const canvas = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.lg };
	min-width: 0;
`
