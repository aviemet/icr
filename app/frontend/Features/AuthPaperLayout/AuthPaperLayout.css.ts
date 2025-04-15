import { css } from "@linaria/core"
import { rem } from "@mantine/core"

import { vars } from "@/lib/theme"

export const loginWrapper = css`
	height: 100%;
`

export const loginPaper = css`
	width: clamp(${rem(vars.breakpoints["2xs"])}, 85vw, ${rem(vars.breakpoints.xs)});
`

export const form = css`
	.field {
		margin-bottom: ${rem(8)};
	}
`

export const bottomLinks = css`
	a {
		display: block;
		padding: ${vars.spacing.md};
		text-align: center;
		background-color: ${vars.colors.primaryColors.light};
		transition: background-color 250ms ease-in-out;
		color: ${vars.colors.white};

		&:hover {
			background-color: ${vars.colors.primaryColors.filled};
			text-decoration: none;
		}
	}

	& > a:first-child {
		border-bottom-left-radius: ${vars.radius.lg};
	}

	& > a:last-child {
		border-bottom-right-radius: ${vars.radius.lg};
	}
`
