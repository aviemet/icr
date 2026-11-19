import { css } from "@linaria/core"

import {
	board,
	tileRow,
} from "@/features/RecordShow/BoardPrimitives.css"
import { vars } from "@/lib/theme"

export {
	board,
	tileRow,
}

export const teamList = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.sm };
`

export const teamRow = css`
	display: flex;
	align-items: center;
	gap: ${ vars.spacing.sm };
	min-width: 0;
`

export const teamMeta = css`
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
`

export const teamRole = css`
	font-size: ${ vars.fontSizes.xs };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`

export const interviewList = css`
	display: flex;
	flex-direction: column;
	gap: 0;
	border: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
	border-radius: ${ vars.radius.md };
	overflow: hidden;
`
