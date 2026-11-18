import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const settingsLayout = css`
	--settings-nav-gap: 4px;

	position: relative;
	border-radius: ${ vars.radius.md };
	padding: ${ vars.spacing.xs };
	margin-top: ${ vars.spacing.sm };
	margin-bottom: ${ vars.spacing.sm };
	display: flex;
	flex-direction: column;
	gap: var(--settings-nav-gap);
	background-color: light-dark(
		${ vars.colors.gray[0] },
		${ vars.colors.dark[7] }
	);

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

	.childRow {
		z-index: 1;
		padding: 4px;
		border-radius: ${ vars.radius.sm };
		background-color: light-dark(
			${ vars.colors.white },
			${ vars.colors.dark[6] }
		);
		box-shadow:
			inset 0 0 0 1px light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] }),
			inset 3px 0 0 0 ${ vars.colors.primaryColors.filled };
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
		padding: 5px 10px;
		font-size: ${ vars.fontSizes.sm };
	}

	.childRow .control[data-active] {
		color: light-dark(${ vars.colors.primaryColors[9] }, ${ vars.colors.white });
	}

	.controlLabel {
		position: relative;
		z-index: 1;
	}

	.indicator {
		background-color: ${ vars.colors.primaryColors.filled };
		border-radius: ${ vars.radius.sm };
	}

	.childRow .indicator {
		background-color: light-dark(
			${ vars.colors.primaryColors[1] },
			color-mix(in srgb, ${ vars.colors.primaryColors[5] } 40%, transparent)
		);
		box-shadow: inset 0 0 0 1px light-dark(
			${ vars.colors.primaryColors[3] },
			color-mix(in srgb, ${ vars.colors.primaryColors[4] } 70%, transparent)
		);
	}
`
