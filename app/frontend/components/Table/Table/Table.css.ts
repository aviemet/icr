import { css } from "@linaria/core"

export const wrapper = css`
	overflow-x: auto;
`

export const table = css`
	width: 100%;

	th.actionsCell,
	td.actionsCell {
		width: 1%;
		white-space: nowrap;
		text-align: center;

		& > * {
			width: fit-content;
			max-width: 100%;
			margin-inline: auto;
		}
	}
`
