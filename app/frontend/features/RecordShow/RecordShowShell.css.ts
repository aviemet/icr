import { css } from "@linaria/core"

import { theme, vars } from "@/lib/theme"

export const viewport = css`
	height: calc(100vh - ${ theme.other.footer.height }px - (${ vars.spacing.sm } * 2));
	min-height: 0;
`

export const shell = css`
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
	gap: ${ vars.spacing.md };
	width: 100%;
	max-width: ${ theme.other.page.maxWidth };
	margin-inline: auto;
`

export const chrome = css`
	flex: 0 0 auto;
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.sm };
`

export const header = css`
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: space-between;
	gap: ${ vars.spacing.sm };
`

export const identity = css`
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
`

export const identityRow = css`
	display: flex;
	align-items: center;
	gap: ${ vars.spacing.sm };
	min-width: 0;
`

export const titleRow = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${ vars.spacing.xs };
`

export const meta = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${ vars.spacing.xs };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
	font-size: ${ vars.fontSizes.sm };
`

export const actions = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${ vars.spacing.xs };
`

export const tabs = css`
	flex: 1 1 auto;
	min-height: 0;
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.sm };
	overflow: hidden;

	.mantine-Tabs-list {
		gap: ${ vars.spacing.xs };
		padding: 0;
		border-bottom: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
		border-radius: 0;
		background-color: transparent;
		border-top: none;
		border-left: none;
		border-right: none;
		flex-wrap: wrap;
	}

	.mantine-Tabs-tab {
		border: none;
		border-radius: 0;
		font-size: ${ vars.fontSizes.sm };
		padding: 8px 10px 10px;
		color: light-dark(${ vars.colors.gray[7] }, ${ vars.colors.dark[0] });
		transition: color 120ms ease, box-shadow 120ms ease;

		&:hover {
			background-color: transparent;
			color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
			box-shadow: inset 0 -2px 0 0 light-dark(${ vars.colors.gray[4] }, ${ vars.colors.dark[3] });
		}

		&[data-active] {
			background-color: transparent;
			color: light-dark(${ vars.colors.primaryColors[9] }, ${ vars.colors.white });
			box-shadow: inset 0 -2px 0 0 ${ vars.colors.primaryColors.filled };
		}

		&::before {
			display: none;
		}
	}

	.mantine-Tabs-panel {
		flex: 1 1 auto;
		min-height: 0;
		overflow: auto;
	}
`
