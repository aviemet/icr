import { css } from "@linaria/core"

import {
	board,
	tileRow,
} from "@/features/RecordShow/BoardPrimitives.css"
import { theme, vars } from "@/lib/theme"

export {
	board,
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

export const columns = css`
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
	gap: ${ vars.spacing.md };

	@media (max-width: 48em) {
		grid-template-columns: 1fr;
	}
`

export const panel = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.sm };
	min-width: 0;
`

export const rosterRow = css`
	cursor: pointer;
	border-radius: ${ vars.radius.sm };
	padding: ${ vars.spacing.xs } ${ vars.spacing.sm };
	border: 1px solid transparent;

	&[data-active="true"] {
		border-color: light-dark(${ vars.colors.blue[4] }, ${ vars.colors.blue[7] });
		background: light-dark(${ vars.colors.blue[0] }, ${ vars.colors.dark[6] });
	}

	&:hover {
		background: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[6] });
	}
`

export const list = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
`
