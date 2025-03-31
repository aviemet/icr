import { css } from "@linaria/core"

import { vars } from "@/lib"

export const calendar = css`
	position: relative;
	display: flex;
	width: 100%;
	height: 100%;
`

export const calendarContainer = css`
	flex: 1 1 0%;
	padding: ${ vars.spacing.sm };
	background-color: ${ vars.colors.dark[8] };
	border-radius: ${ vars.radius.lg };
	margin-bottom: ${ vars.spacing.md };
`
