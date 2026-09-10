import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const indicator = css`
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  border-top: 1px dotted ${ vars.colors.blue[6] };
  pointer-events: none;
  z-index: 1;
`
