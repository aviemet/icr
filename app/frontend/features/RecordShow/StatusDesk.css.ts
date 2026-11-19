import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const desk = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.md };
`

export const hero = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: ${ vars.spacing.sm };
	padding: ${ vars.spacing.md };
	border-radius: ${ vars.radius.md };
	border: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
	background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[7] });
`

export const formCanvas = css`
	padding: ${ vars.spacing.md };
	border-radius: ${ vars.radius.md };
	border: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
	background-color: light-dark(${ vars.colors.white }, ${ vars.colors.dark[8] });
`

export const picker = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
`
