import { css } from "@linaria/core"

import { vars } from "@/lib/css"

export const container = css`
	position: absolute;
	z-index: 250;
	opacity: 1;
	transform: translateY(0);
	transition: opacity 0.12s ease-out, transform 0.12s ease-out;

	&[data-entering] {
		opacity: 0;
		transform: translateY(6px);
	}

	&[data-exiting] {
		opacity: 0;
		transform: translateY(6px);
	}
`

export const eventColor = css`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	flex-shrink: 0;
`

export const paper = css`
	min-width: 300px;
	max-width: 400px;
	padding: ${ vars.spacing.md };
`
