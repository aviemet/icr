import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const row = css`
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: space-between;
	gap: ${ vars.spacing.xs } ${ vars.spacing.sm };
	padding: ${ vars.spacing.xs } ${ vars.spacing.sm };
	border-bottom: 1px solid light-dark(${ vars.colors.gray[2] }, ${ vars.colors.dark[5] });

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background-color: light-dark(
			${ vars.colors.gray[0] },
			color-mix(in srgb, ${ vars.colors.white } 4%, ${ vars.colors.dark[8] })
		);
	}
`

export const main = css`
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 0;
	flex: 1 1 12rem;
`

export const title = css`
	font-weight: 600;
	font-size: ${ vars.fontSizes.sm };
	line-height: 1.3;
`

export const meta = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${ vars.spacing.xs };
	font-size: ${ vars.fontSizes.xs };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`

export const actions = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${ vars.spacing.xs };
	flex: 0 0 auto;
`

export const warning = css`
	& [data-record-row-title] {
		color: light-dark(${ vars.colors.yellow[8] }, ${ vars.colors.yellow[4] });
	}
`

export const danger = css`
	& [data-record-row-title] {
		color: light-dark(${ vars.colors.red[7] }, ${ vars.colors.red[4] });
	}
`
