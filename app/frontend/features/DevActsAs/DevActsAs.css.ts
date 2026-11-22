import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const banner = css`
	position: sticky;
	top: -${ vars.spacing.sm };
	z-index: 50;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${ vars.spacing.md };
	padding: ${ vars.spacing.xs } ${ vars.spacing.md };
	margin: calc(-1 * ${ vars.spacing.sm }) calc(-1 * ${ vars.spacing.sm }) ${ vars.spacing.sm };
	background-color: light-dark(${ vars.colors.yellow[1] }, ${ vars.colors.dark[5] });
	border-bottom: 1px solid light-dark(${ vars.colors.yellow[4] }, ${ vars.colors.yellow[8] });
	color: light-dark(${ vars.colors.dark[7] }, ${ vars.colors.gray[1] });
`

export const candidateRow = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: ${ vars.spacing.sm };
	width: 100%;
	padding: ${ vars.spacing.sm };
	border-radius: ${ vars.radius.sm };
	border: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
	background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[7] });
	text-align: left;
	cursor: pointer;
`

export const candidateRowActive = css`
	border-color: ${ vars.colors.yellow[6] };
	background-color: light-dark(${ vars.colors.yellow[0] }, ${ vars.colors.dark[5] });
`
