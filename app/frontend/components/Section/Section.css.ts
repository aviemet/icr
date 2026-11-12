import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const root = css`  
  padding: ${ vars.spacing.md } ${ vars.spacing.sm };

  & + & {
    margin-top: 10,
  }
`
