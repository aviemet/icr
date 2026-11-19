import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const dropzone = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: ${ vars.spacing.xs };
	padding: ${ vars.spacing.lg } ${ vars.spacing.md };
	border-radius: ${ vars.radius.md };
	border: 1px dashed light-dark(${ vars.colors.gray[4] }, ${ vars.colors.dark[3] });
	background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[7] });
	cursor: pointer;
	text-align: center;
	transition: border-color 120ms ease, background-color 120ms ease;

	&:hover,
	&:focus-within {
		border-color: ${ vars.colors.primaryColors.filled };
		background-color: light-dark(
			color-mix(in srgb, ${ vars.colors.primaryColors[1] } 45%, ${ vars.colors.white }),
			color-mix(in srgb, ${ vars.colors.primaryColors[9] } 20%, ${ vars.colors.dark[7] })
		);
	}
`

export const label = css`
	font-size: ${ vars.fontSizes.sm };
	font-weight: 600;
`

export const hint = css`
	font-size: ${ vars.fontSizes.xs };
	color: light-dark(${ vars.colors.gray[6] }, ${ vars.colors.dark[1] });
`

export const input = css`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
`
