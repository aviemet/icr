import { css } from "@linaria/core"

import { vars } from "@/lib/css"

export const event = css`
  font-size: ${ vars.fontSizes.xs };
  border-radius: ${ vars.radius.sm };
  color: var(--contrasting-color);
  margin: 1px 3px;
  cursor: pointer;
  position: relative;
  text-overflow: ellipsis;

  &.filled {
    background-color: var(--event-color);
    color: var(--contrasting-color);
    box-shadow: ${ vars.shadows.xs };
  }
`
