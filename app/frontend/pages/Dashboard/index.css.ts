import { css } from "@linaria/core"

import { vars } from "@/lib/css"

export const card = css`
  height: 100%;
  transition: transform 0.2s ease;

  a {
    color: ${ vars.colors.blue[6] };
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`
