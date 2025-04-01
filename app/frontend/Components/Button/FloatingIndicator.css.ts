import { css } from "@linaria/core"

import { vars } from "@/lib"

export const root = css`
	position: relative;
	background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.gray[9] });
	width: fit-content;
	border: 1px solid light-dark(${ vars.colors.gray[2] }, ${ vars.colors.gray[7] });
`

export const control = css`
	padding: var(--floating-indicator-padding);
	padding-left: var(--floating-indicator-indicator-padding);
	padding-right: var(--floating-indicator-indicator-padding);
	color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
	font-size: ${ vars.fontSizes.sm };
	transition: color 100ms ease-in-out;
	font-weight: 500;
	height: var(--mantine-button-height);
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
	background-color: ${ vars.colors.primaryColors.filled };
	border-radius:  var(--floating-indicator-radius);
	padding-left: var(--floating-indicator-indicator-padding);
	padding-right: var(--floating-indicator-indicator-padding);
`
