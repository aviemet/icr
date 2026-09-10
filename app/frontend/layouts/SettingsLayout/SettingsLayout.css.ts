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

		/* @mixin hover {
			color: light-dark(var(--mantine-color-black), var(--mantine-color-white));
			background-color: light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-7));
		} */

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

