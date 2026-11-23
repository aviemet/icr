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

export const secondaryRow = css`
	display: grid;
	grid-template-columns: 1fr;
	gap: ${ vars.spacing.md };
	align-items: start;

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

export const customLinks = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.sm };
	margin-top: ${ vars.spacing.sm };
	padding-top: ${ vars.spacing.sm };
	border-top: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
`

export const customLinksHeader = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${ vars.spacing.sm };
`

export const modifyLink = css`
	font-size: ${ vars.fontSizes.xs };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
	text-decoration: underline;
	text-underline-offset: 2px;

	&:hover {
		color: light-dark(${ vars.colors.gray[8] }, ${ vars.colors.gray[3] });
	}
`

export const customLinksList = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
`
