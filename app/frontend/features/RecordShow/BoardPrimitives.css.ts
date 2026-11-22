import { css } from "@linaria/core"

import { theme, vars } from "@/lib/theme"

export const viewport = css`
	width: 100%;
	max-width: ${ theme.other.page.maxWidth };
	margin-inline: auto;
	padding: ${ vars.spacing.md };
`

export const board = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.lg };
`

export const chrome = css`
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: space-between;
	gap: ${ vars.spacing.md };
`

export const identity = css`
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-width: 0;
`

export const subtitle = css`
	font-size: ${ vars.fontSizes.sm };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`

export const panel = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.sm };
	min-width: 0;
`

export const metricStrip = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: ${ vars.spacing.md };
	align-items: stretch;

	@media (min-width: ${ vars.breakpoints.sm }) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@media (min-width: ${ vars.breakpoints.lg }) {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
`

export const tileRow = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: ${ vars.spacing.md };
	align-items: stretch;

	@media (min-width: ${ vars.breakpoints.sm }) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	@media (min-width: ${ vars.breakpoints.lg }) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
`

export const secondaryRow = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: ${ vars.spacing.md };
	align-items: stretch;

	@media (min-width: ${ vars.breakpoints.md }) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
`

export const metricLine = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: ${ vars.spacing.sm };
	font-size: ${ vars.fontSizes.sm };
`

export const metricLabel = css`
`

export const metricLink = css`
	text-decoration: none;
	color: inherit;
	border-radius: ${ vars.radius.sm };
	transition: opacity 120ms ease;

	&:hover {
		opacity: 0.82;
	}
`

export const metricValueRow = css`
	display: flex;
	align-items: baseline;
	gap: ${ vars.spacing.sm };
	flex-wrap: wrap;
`

export const metricValue = css`
	font-size: ${ vars.fontSizes.xl };
	font-weight: 700;
	line-height: 1.2;
	color: light-dark(${ vars.colors.primaryColors[8] }, ${ vars.colors.primaryColors[3] });
`

export const metricValueLabel = css`
	font-size: ${ vars.fontSizes.sm };
	line-height: 1.2;
`

export const chip = css`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 1.5rem;
	padding: 0 6px;
	border-radius: 999px;
	font-size: ${ vars.fontSizes.xs };
	font-weight: 600;
	background-color: light-dark(${ vars.colors.gray[2] }, ${ vars.colors.dark[5] });
`

export const chipAlert = css`
	background-color: light-dark(${ vars.colors.orange[1] }, ${ vars.colors.orange[9] });
	color: light-dark(${ vars.colors.orange[9] }, ${ vars.colors.orange[2] });
`

export const actionGrid = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: ${ vars.spacing.sm };
	margin-top: auto;
	padding-top: ${ vars.spacing.sm };

	@media (min-width: ${ vars.breakpoints.xs }) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
`

export const actionTile = css`
	display: flex;
	flex-direction: column;
	gap: 2px;
	padding: ${ vars.spacing.sm } ${ vars.spacing.md };
	border-radius: ${ vars.radius.sm };
	border: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
	background-color: light-dark(
		color-mix(in srgb, ${ vars.colors.primaryColors[0] } 55%, ${ vars.colors.white }),
		color-mix(in srgb, ${ vars.colors.primaryColors.filled } 10%, ${ vars.colors.dark[7] })
	);
	text-decoration: none;
	color: inherit;
	transition: border-color 120ms ease, background-color 120ms ease;

	&:hover {
		border-color: ${ vars.colors.primaryColors.filled };
		background-color: light-dark(
			color-mix(in srgb, ${ vars.colors.primaryColors[1] } 55%, ${ vars.colors.white }),
			color-mix(in srgb, ${ vars.colors.primaryColors.filled } 18%, ${ vars.colors.dark[7] })
		);
	}
`

export const actionTitle = css`
	font-size: ${ vars.fontSizes.sm };
	font-weight: 600;
`

export const actionHint = css`
	font-size: ${ vars.fontSizes.xs };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`
