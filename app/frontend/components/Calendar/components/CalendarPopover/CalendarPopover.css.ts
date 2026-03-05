import { css } from "@linaria/core"

import { vars } from "@/lib/css"

export const container = css`
	position: absolute;
	z-index: 250;
	transform-origin: top left;
	opacity: 1;
	transition: top 0.2s ease-out, left 0.2s ease-out, opacity 0.15s ease-out, transform 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out;

	&[data-entering] {
		opacity: 0;
		transform: scale(0.95);
	}

	&[data-exiting] {
		opacity: 0;
		transform: scale(0.95);
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
