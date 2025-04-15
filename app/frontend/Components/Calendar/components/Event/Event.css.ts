import { css } from "@linaria/core"

import { vars } from "@/lib"

export const event = css`
  font-size: ${ vars.fontSizes.xs };
  border-radius: ${ vars.radius.sm };
  padding: 2px 5px 2px 6px;
  margin: 1px 3px;
  color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
  cursor: pointer;
  position: relative;

  &.filled {
    background-color: var(--event-color);
    color: var(--contrasting-color);
    box-shadow: ${ vars.shadows.xs };
  }
`
