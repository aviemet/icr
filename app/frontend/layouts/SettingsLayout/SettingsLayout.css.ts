import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const settingsLayout = css`
	position: relative;
	border-radius: ${ vars.radius.md };
	padding: ${ vars.spacing.sm };
	margin-top: ${ vars.spacing.sm };
	margin-bottom: ${ vars.spacing.sm };

	.control {
		padding: 7px 12px;
		line-height: 1;

		&[data-active] {
			color: var(--mantine-color-white);
		}
	}

	.controlLabel {
		position: relative;
		z-index: 1;
	}

	.indicator {
		background-color: ${ vars.colors.primaryColors.filled };
		border-radius: ${ vars.radius.md };
	}
`

export const settingsSubNav = css`
	margin-top: 0;
	padding: ${ vars.spacing.xs };

	.control {
		padding: 5px 10px;
		font-size: ${ vars.fontSizes.sm };
	}

	.indicator {
		opacity: 0.85;
	}
`

