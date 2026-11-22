import { css } from "@linaria/core"

export const footer = css`
	pointer-events: none;

	& > * {
		pointer-events: auto;
	}
`
