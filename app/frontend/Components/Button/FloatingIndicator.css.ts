import { css } from "@linaria/core"

import { vars } from "@/lib"

export const root = css`
  position: relative;
  background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.gray[9] });
  width: fit-content;
  border-radius: ${ vars.radius.md };
  padding: 5px;
  border: 1px solid light-dark(${ vars.colors.gray[2] }, ${ vars.colors.gray[7] });
`
export const control = css`
	padding: 7px 12px;
	line-height: 1;
	color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
	border-radius: ${ vars.radius.md };
	font-size: ${ vars.fontSizes.sm };
	transition: color 100ms ease-in-out;

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
	border-radius: ${ vars.radius.md };
`
