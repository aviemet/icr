import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const imageGrid = css`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
	gap: ${ vars.spacing.sm };
`

export const imageCard = css`
	display: flex;
	flex-direction: column;
	gap: ${ vars.spacing.xs };
	padding: ${ vars.spacing.xs };
	border: 1px solid light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] });
	border-radius: ${ vars.radius.md };
	background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[7] });
`
