import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const tile = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.sm };
	height: 100%;
`

export const titleRow = css`
	display: flex;
	align-items: center;
	gap: ${ vars.spacing.sm };
`

export const icon = css`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.85rem;
	height: 1.85rem;
	border-radius: ${ vars.radius.sm };
	flex: 0 0 auto;
	color: ${ vars.colors.primaryColors.filled };
	background-color: light-dark(
		color-mix(in srgb, ${ vars.colors.primaryColors[1] } 75%, ${ vars.colors.white }),
		color-mix(in srgb, ${ vars.colors.primaryColors.filled } 22%, ${ vars.colors.dark[6] })
	);
`

export const iconAlert = css`
	color: light-dark(${ vars.colors.yellow[8] }, ${ vars.colors.yellow[3] });
	background-color: light-dark(
		color-mix(in srgb, ${ vars.colors.yellow[2] } 80%, ${ vars.colors.white }),
		color-mix(in srgb, ${ vars.colors.yellow[7] } 28%, ${ vars.colors.dark[6] })
	);
`

export const iconDanger = css`
	color: light-dark(${ vars.colors.red[7] }, ${ vars.colors.red[3] });
	background-color: light-dark(
		color-mix(in srgb, ${ vars.colors.red[1] } 80%, ${ vars.colors.white }),
		color-mix(in srgb, ${ vars.colors.red[7] } 28%, ${ vars.colors.dark[6] })
	);
`

export const title = css`
	font-size: ${ vars.fontSizes.xs };
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`

export const body = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
	flex: 1 1 auto;
`
