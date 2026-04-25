import { css } from "@linaria/core"

import { vars } from "@/lib/css"
import { event, indicator, title } from "@/components/Calendar/components/Event/Event.css"

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
  position: relative;
`

export const allDayEvent = css``

export const timeGridEvent = css`
  background-color: var(--event-color);
  color: var(--contrasting-color);
  padding: 4px 6px;
  border-radius: 4px;
  border-color: light-dark(${ vars.colors.gray[2] }, ${ vars.colors.gray[9] });
  border-width: 0.25px;
  cursor: pointer;
  height: calc(100% - 2px);
  transition: background-color 200ms ease-in-out;
  width: 100%;
  box-shadow: ${ vars.shadows.sm };
  display: flex;
  gap: 0;
  min-width: 0;
  position: relative;

  &.${ event } {
    align-items: flex-start;
  }

  &:not(.${ allDayEvent }) {
    padding-top: 6px;
  }

  &:not(.${ allDayEvent }) .${ indicator } {
    position: absolute;
    top: 6px;
    right: 3px;
    transform: translate(50%, -50%);
    width: 1rem;
    height: 1rem;
    padding: 2px 5px 0 6px;
    border-radius: 3px;
    margin-right: 0;
    flex: 0 0 auto;
  }

  &:not(.${ allDayEvent }) .${ title } {
    width: 100%;
    padding-left: 0;
  }

  &:hover {
    filter: brightness(0.9);
    z-index: 2;
  }

  &.${ allDayEvent } {
    padding: 2px 4px 0 0;
    overflow: hidden;
    white-space: nowrap;
    grid-column: var(--column-start) / span var(--column-span);
    position: relative;

    .${ indicator } {
      width: 1rem;
      height: 100%;
      padding: 0;
      margin-right: 0;
      border-radius: 0;
      border-top-left-radius: inherit;
      border-bottom-left-radius: inherit;
      align-self: stretch;
    }

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
