import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const row = css`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 2px;
`

export const control = css`
	padding: 8px 12px 4px;
	line-height: 1;
	border: none;
	border-radius: 0;
	background-color: transparent;
	font-size: ${ vars.fontSizes.sm };
	color: light-dark(${ vars.colors.gray[7] }, ${ vars.colors.dark[0] });
	cursor: pointer;
	transition: color 120ms ease;

	&:hover {
		background-color: transparent;
		color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
	}

	&:hover .label {
		box-shadow: inset 0 -2px 0 0 light-dark(${ vars.colors.gray[4] }, ${ vars.colors.dark[3] });
	}

	&[data-active="true"] {
		color: light-dark(${ vars.colors.primaryColors[9] }, ${ vars.colors.white });
	}

	&[data-active="true"] .label {
		box-shadow: inset 0 -2px 0 0 ${ vars.colors.primaryColors.filled };
	}
`

export const controlLabel = css`
	display: inline-block;
	padding-bottom: 4px;
	box-shadow: inset 0 -2px 0 0 transparent;
	transition: box-shadow 120ms ease;
`
