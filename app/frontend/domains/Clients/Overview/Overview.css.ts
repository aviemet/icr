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
	tileRow,
} from "@/features/RecordShow/BoardPrimitives.css"
import { vars } from "@/lib/theme"

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
	tileRow,
}

export const secondaryRow = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: ${ vars.spacing.md };
	align-items: stretch;

	@media (min-width: ${ vars.breakpoints.md }) {
		grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
	}
`

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
