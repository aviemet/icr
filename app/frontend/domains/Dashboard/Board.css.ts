import { css } from "@linaria/core"

import {
	actionGrid,
	actionHint,
	actionTile,
	actionTitle,
	board,
	chip,
	chipAlert,
	metricLabel,
	metricLine,
	metricValue,
	secondaryRow,
	tileRow,
} from "@/features/RecordShow/BoardPrimitives.css"
import { theme, vars } from "@/lib/theme"

export {
	actionGrid,
	actionHint,
	actionTile,
	actionTitle,
	board,
	chip,
	chipAlert,
	metricLabel,
	metricLine,
	metricValue,
	secondaryRow,
	tileRow,
}

export const viewport = css`
	width: 100%;
	max-width: ${ theme.other.page.maxWidth };
	margin-inline: auto;
	padding: ${ vars.spacing.md };
`

export const chrome = css`
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	gap: ${ vars.spacing.md };
`

export const identity = css`
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-width: 0;
`

export const subtitle = css`
	font-size: ${ vars.fontSizes.sm };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`

export const list = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.sm };
`

export const listItem = css`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	gap: ${ vars.spacing.sm };
	font-size: ${ vars.fontSizes.sm };
`

export const listMeta = css`
	flex: 0 0 auto;
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
	font-size: ${ vars.fontSizes.xs };
`
