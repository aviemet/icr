import { css } from "@linaria/core"

import { vars } from "@/lib"

export const borderColor = `light-dark(${ vars.colors.gray[5] }, ${ vars.colors.dark[2] })`

export const calendar = css`
	position: relative;
	display: flex;
	width: 100%;
	height: 100%;
`

export const calendarContainer = css`
	flex: 1 1 0%;
	padding: ${ vars.spacing.sm };
	background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[8] });
	border-radius: ${ vars.radius.lg };
	border-width: 1px;
	border-color: ${ borderColor };
	margin-bottom: 0;
`
