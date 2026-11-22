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
	gap: ${ vars.spacing.sm };
	width: 100%;
	max-width: ${ theme.other.page.maxWidth };
	margin-inline: auto;
`

export const chrome = css`
	--settings-nav-gap: 4px;

	flex: 0 0 auto;
	position: relative;
	display: flex;
	flex-direction: column;
	gap: var(--settings-nav-gap);

	.parentRow,
	.childRow {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 2px;
	}

	.parentRow {
		z-index: 2;
	}

	.companyLinks {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 2px;
		min-width: 0;
	}

	.userSettingsLink {
		margin-left: auto;
	}

	.childRow {
		z-index: 1;
		padding-top: 6px;
		border-top: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
	}

	.control {
		padding: 7px 12px;
		line-height: 1;
		border-radius: ${ vars.radius.sm };
		transition: color 120ms ease, background-color 120ms ease;

		&:not([data-active]):hover {
			background-color: light-dark(
				${ vars.colors.gray[2] },
				color-mix(in srgb, ${ vars.colors.white } 8%, transparent)
			);
		}

		&[data-active] {
			color: var(--mantine-color-white);
		}
	}

	.childRow .control {
		padding: 8px 12px 4px;
		font-size: ${ vars.fontSizes.sm };
		border-radius: 0;
		background-color: transparent;
		transition: color 120ms ease;
	}

	.childRow .control[data-active] {
		color: light-dark(${ vars.colors.primaryColors[9] }, ${ vars.colors.white });
		background-color: transparent;
	}

	.childRow .control:not([data-active]):hover {
		background-color: transparent;
	}

	.childRow .control .controlLabel {
		display: inline-block;
		padding-bottom: 4px;
		box-shadow: inset 0 -2px 0 0 transparent;
		transition: box-shadow 120ms ease;
	}

	.childRow .control[data-active] .controlLabel {
		box-shadow: inset 0 -2px 0 0 ${ vars.colors.primaryColors.filled };
	}

	.childRow .control:not([data-active]):hover .controlLabel {
		box-shadow: inset 0 -2px 0 0 light-dark(${ vars.colors.gray[4] }, ${ vars.colors.dark[3] });
	}

	.controlLabel {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.controlIcon {
		display: inline-flex;
		flex-shrink: 0;
		font-size: 0.875rem;
		line-height: 1;
	}

	.indicator {
		background-color: ${ vars.colors.primaryColors.filled };
		border-radius: ${ vars.radius.sm };
	}
`

export const body = css`
	flex: 1 1 auto;
	min-height: 0;
	overflow: auto;
`
