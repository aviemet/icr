import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const fab = css`
	position: fixed;
	right: ${ vars.spacing.md };
	bottom: calc(${ vars.spacing.md } + ${ vars.spacing.xl });
	z-index: 400;
	width: 2.75rem;
	height: 2.75rem;
	border-radius: ${ vars.radius.md };
	border: 1px solid light-dark(${ vars.colors.gray[4] }, ${ vars.colors.dark[3] });
	background-color: light-dark(${ vars.colors.white }, ${ vars.colors.dark[6] });
	color: light-dark(${ vars.colors.dark[7] }, ${ vars.colors.gray[2] });
	box-shadow: light-dark(
		0 2px 8px color-mix(in srgb, ${ vars.colors.dark[9] } 12%, transparent),
		0 2px 10px color-mix(in srgb, ${ vars.colors.black } 45%, transparent)
	);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
`

export const fabActive = css`
	border-color: ${ vars.colors.yellow[6] };
	background-color: light-dark(${ vars.colors.yellow[1] }, ${ vars.colors.dark[5] });
	color: light-dark(${ vars.colors.yellow[9] }, ${ vars.colors.yellow[3] });
`

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
