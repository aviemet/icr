import { css } from "@linaria/core"

import { vars } from "@/lib"

export const root = css`
	position: relative;
	background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.dark[8] });
	width: fit-content;
	border: 1px solid light-dark(${ vars.colors.gray[2] }, ${ vars.colors.gray[7] });
`

export const control = css`
	color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
	transition: color 100ms ease-in-out;
	display: inline-flex;
	align-items: center;

	&[data-active] {
		color: ${ vars.colors.white };
	}
`

export const controlLabel = css`
	position: relative;
	z-index: 1;
`
export const indicator = css`
	margin-top: 1px;
	background-color: ${ vars.colors.primaryColors.filled };
	border-radius:  var(--floating-indicator-radius);
`
