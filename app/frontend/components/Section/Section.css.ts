import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const root = css`
	padding: ${ vars.spacing.md } ${ vars.spacing.sm };

	& + & {
		margin-top: ${ vars.spacing.sm };
	}
`

export const fullHeight = css`
	height: 100%;
	min-height: 0;
	display: flex;
	flex-direction: column;
`

export const panel = css`
	min-width: 0;
`

export const accent = css`
	box-shadow:
		inset 3px 0 0 0 var(--section-accent, ${ vars.colors.primaryColors.filled }),
		light-dark(
			0 1px 2px color-mix(in srgb, ${ vars.colors.dark[9] } 6%, transparent),
			0 1px 3px color-mix(in srgb, ${ vars.colors.black } 40%, transparent)
		);
`
