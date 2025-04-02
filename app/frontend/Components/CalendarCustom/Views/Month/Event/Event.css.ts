import { css } from "@linaria/core"

import { eventHeight } from "@/Components/CalendarCustom/Views/Month/MonthView.css"
import { vars } from "@/lib"


export const eventWrapper = css`
  --column-start: 1;
  --column-span: 1;
  --event-color: ${ vars.colors.primaryColors.filled };
  --contrasting-color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
  min-height: ${ eventHeight };
  overflow: hidden;
  pointer-events: all;
  grid-column: var(--column-start) / span var(--column-span);
`

export const event = css`
  font-size: ${ vars.fontSizes.xs };
  border-radius: ${ vars.radius.sm };
  padding: 2px 5px;
  margin: 1px 3px;
  color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
  cursor: pointer;
  min-height: ${ eventHeight };

  &::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--event-color);
    margin-right: 4px;
    vertical-align: middle;
  }
`

export const eventContinues = css`
  & .${ event } {
    background-color: var(--event-color);
    color: var(--contrasting-color);
  }
`
