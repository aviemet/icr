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
  display: flex;
  align-items: center;
  min-width: 0;

  &.filled {
    background-color: var(--event-color);
    color: var(--contrasting-color);
    box-shadow: ${ vars.shadows.xs };
  }
`

export const hasIndicator = css``

export const indicator = css`
  width: 1rem;
  height: 100%;
  flex: 0 0 auto;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
  background-color: var(--indicator-color);
  color: var(--indicator-contrast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
`

export const title = css`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 4px;
`
