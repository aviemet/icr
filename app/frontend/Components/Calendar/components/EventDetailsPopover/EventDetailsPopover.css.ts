import { css } from "@linaria/core"

import { vars } from "@/lib"

export const container = css`
	position: absolute;
	z-index: 1000;
	transform-origin: top left;
	opacity: 1;

	/* Add a subtle scale animation when the popover appears */
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
