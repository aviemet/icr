import { css } from "@linaria/core"

export const table = css`
	th {
		white-space: nowrap;
	}

	th:last-child,
	td:last-child {
		padding-right: 14px;
	}
`

export const header = css`
	th {
		cursor: pointer;
		user-select: none;
	}
`

export const root = css`
	flex: 1;
	min-height: 0;
	display: flex;
	flex-direction: column;
`
