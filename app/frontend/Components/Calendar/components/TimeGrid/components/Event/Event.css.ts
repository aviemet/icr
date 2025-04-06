import { css } from "@linaria/core"

export const event = css`
  pointer-events: auto;
  background-color: var(--event-color);
  color: var(--contrasting-color);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  overflow: hidden;
  cursor: pointer;
  grid-column: var(--event-column);
  grid-row: var(--event-start-row) / span var(--event-span);
  margin: 2px;
  z-index: 1;
  transition: all 200ms ease-in-out;

  &:hover {
    filter: brightness(0.9);
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
