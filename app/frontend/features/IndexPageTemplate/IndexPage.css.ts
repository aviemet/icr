import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const title = css`
	flex: 1 1 auto;
	min-width: 0;

	h1 {
		margin-bottom: 0;
	}
`

export const titleSpacer = css`
	display: none;

	@media (min-width: ${ vars.breakpoints.md }) {
		display: block;
		flex: 1 1 1rem;
		min-width: 1.5rem;
	}
`

const maxSearchWidth = "42rem"

export const content = css`
	flex: 1 1 100%;
	width: 100%;
	display: flex;
	justify-content: flex-end;
	min-width: 12rem;

	@media (min-width: ${ vars.breakpoints.md }) {
		flex: 0 1 ${ maxSearchWidth };
		max-width: ${ maxSearchWidth };
	}
`
