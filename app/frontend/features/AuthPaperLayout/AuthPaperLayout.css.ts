import { css } from "@linaria/core"

import { rem, vars } from "@/lib/css"

export const loginWrapper = css`
	height: 100%;
`

export const loginPaper = css`
	width: clamp(${ rem(vars.breakpoints["2xs"]) }, 90vw, ${ rem(440) });
	overflow: hidden;

	[data-mantine-color-scheme="light"] & {
		background-color: color-mix(in srgb, ${ vars.colors.white } 92%, transparent);
		backdrop-filter: blur(10px);
	}

	[data-mantine-color-scheme="dark"] & {
		background-color: color-mix(in srgb, ${ vars.colors.dark[7] } 88%, transparent);
		backdrop-filter: blur(12px);
	}
`

export const form = css`
	.field {
		margin-bottom: ${ rem(8) };
	}
`

export const bottomLinks = css`
	a {
		display: block;
		padding: ${ vars.spacing.md };
		text-align: center;
		background-color: ${ vars.colors.primaryColors.light };
		transition: background-color 250ms ease-in-out;
		color: ${ vars.colors.white };

		&:hover {
			background-color: ${ vars.colors.primaryColors.filled };
			text-decoration: none;
		}
	}

	& > a:first-child {
		border-bottom-left-radius: ${ vars.radius.md };
	}

	& > a:last-child {
		border-bottom-right-radius: ${ vars.radius.md };
	}
`
