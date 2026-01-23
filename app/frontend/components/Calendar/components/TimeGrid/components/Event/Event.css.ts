import { css } from "@linaria/core"

import { vars } from "@/lib/css"

export const eventWrapper = css`
  --column-start: 1;
  --column-span: 1;
  --row-start: 1;
  --row-span: 1;
  --event-color: ${ vars.colors.primaryColors.filled };
  --contrasting-color: light-dark(${ vars.colors.black }, ${ vars.colors.white });
  --hover-color: color-mix(
          in srgb,
          var(--event-color) 85%,
          white
        );

  overflow: hidden;
  margin: 1px;
  font-size: ${ vars.fontSizes.xs };
  grid-column: var(--column-start) / span var(--column-span);
  grid-row: var(--row-start) / span var(--row-span);
`

export const allDayEvent = css``

export const timeGridEvent = css`
  background-color: var(--event-color);
  color: var(--contrasting-color);
  padding: 4px 4px 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  height: calc(100% - 2px);
  transition: background-color 200ms ease-in-out;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    filter: brightness(0.9);
    z-index: 2;
  }

  &.${ allDayEvent } {
    padding: 2px 4px 0 8px;
    overflow: hidden;
    white-space: nowrap;
    grid-column: var(--column-start) / span var(--column-span);
    position: relative;

    &.continues-from {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: 0;
    }

    &.continues-to {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      margin-right: 0;
    }
  }
`

export const stackedEvent = css`
  position: relative;
  z-index: var(--event-z-index);

  &:hover {
    z-index: 999;
  }
`

export const splitEvent = css`
  width: var(--event-width, 100%);
  left: var(--event-left, 0);
  position: relative;
`
