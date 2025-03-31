import { css } from "@linaria/core"

import { vars } from "@/lib/theme"

export const calendar = css`
  .month_default_main {
    color: ${vars.colors.white};
    border-radius: ${vars.radius.md};
  }

  .month_default_header {
    &:first-of-type .month_default_header_inner {
      border-top-left-radius: ${vars.radius.md};
    }

    &:last-of-type .month_default_header_inner {
      border-top-right-radius: ${vars.radius.md};
    }
  }

  .month_default_header_inner {
    color: ${vars.colors.white};
    background-color: ${vars.colors.primaryColors[8]};
  }

  .month_default_cell_inner {
    background-color: ${vars.colors.dark[5]};
  }
`
