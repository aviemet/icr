import { css } from "@linaria/core"

import { vars } from "@/lib"

export const buttonsContainer = css`
  position: relative;
  background-color: light-dark(${ vars.colors.gray[0] }, ${ vars.colors.gray[9] });
  width: fit-content;
  padding: ${ vars.spacing.xxs };
  border: 1px solid light-dark(${ vars.colors.gray[2] }, ${ vars.colors.gray[7] });

	button {
    color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
	}
`

export const datePickerMenu = css`
  transition: transform 200ms ease;

  &.opened {
    transform: rotate(-180deg);
  }
`
