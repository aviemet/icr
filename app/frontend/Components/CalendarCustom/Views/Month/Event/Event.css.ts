import { css } from "@linaria/core"

import { eventHeight } from "@/Components/CalendarCustom/Views/Month/MonthView.css"
import { vars } from "@/lib"

export const eventWrapper = css`
  --column-start: 1;
  --column-span: 1;
  height: ${ eventHeight };
  overflow: hidden;
  pointer-events: all;
  grid-column: var(--column-start) / span var(--column-span);
`

export const event = css`
  background-color: ${ vars.colors.primary };
  font-size: 0.75rem;
  border-radius: ${ vars.radius.sm };
  padding: 2px 5px;
  margin: 1px 3px;
  color: ${ vars.colors.black };
  cursor: pointer;
  height: ${ eventHeight };
  overflow: hidden;
`
