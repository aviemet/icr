import { css } from "@linaria/core"

export const scopeMenuButton = css`
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	border-right: 0;
`

export const searchWithLeading = css`
	input {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
`

export const searchCluster = css`
	display: flex;
	flex: 1 1 auto;
	width: 100%;
	max-width: 100%;
	align-items: stretch;
	height: 36px;
	gap: 0;
`
