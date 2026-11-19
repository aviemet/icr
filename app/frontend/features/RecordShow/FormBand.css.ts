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
	border-bottom: 2px solid light-dark(
		color-mix(in srgb, ${ vars.colors.primaryColors.filled } 35%, ${ vars.colors.gray[3] }),
		color-mix(in srgb, ${ vars.colors.primaryColors.filled } 55%, ${ vars.colors.dark[4] })
	);
`

export const titleRow = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${ vars.spacing.sm };
	min-width: 0;
`

export const titleGroup = css`
	display: flex;
	align-items: center;
	gap: ${ vars.spacing.sm };
	min-width: 0;
`

export const title = css`
	font-size: ${ vars.fontSizes.sm };
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: light-dark(${ vars.colors.primaryColors[8] }, ${ vars.colors.primaryColors[3] });
`

export const description = css`
	font-size: ${ vars.fontSizes.sm };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`

export const descriptionIndented = css`
	padding-inline-start: calc(1.85rem + ${ vars.spacing.sm });
`

export const fields = css`
	display: block;
`

export const stack = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.md };
`
