import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const searchWrapper = css`
	display: flex;
	flex: 1 1 auto;
	width: 100%;
	max-width: 100%;
	align-items: stretch;
	height: 36px;
`

export const searchInput = css`
	flex: 1;

	input {
		height: 36px;
		min-height: 36px;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		border-top-left-radius: ${ vars.radius.sm };
		border-bottom-left-radius: ${ vars.radius.sm };
	}
`

export const columnPickerButton = css`
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
`
