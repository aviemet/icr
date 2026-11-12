import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const external = css`
	display: inline-block;

	.react-icon.external {
		display: inline-block;
		vertical-align: text-top;
	}
	
	&[disabled], &[data-disabled] {
		pointer-events: none;
	}
`

export const link = css`
	cursor: pointer;
`
