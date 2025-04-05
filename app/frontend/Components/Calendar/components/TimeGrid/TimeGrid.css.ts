import { css } from "@linaria/core"

export const timeGrid = css`
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const timeColumn = css`
  display: flex;
  flex-direction: column;
  padding-right: 1rem;
  border-right: 1px solid var(--mantine-color-gray-3);
  grid-row: 2;
  grid-column: 1;
  position: relative;
  z-index: 1;
`

export const timeSlot = css`
  height: var(--time-slot-height, 60px);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  color: var(--mantine-color-gray-6);
  font-size: var(--mantine-font-size-sm);
  position: relative;
  padding-top: 0.25rem;

  /* Solid line at the top of each time slot */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: -1rem;
    border-top: 1px solid var(--mantine-color-gray-3);
  }

  /* Dotted line in the middle of each time slot */
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: -1rem;
    border-top: 1px dotted var(--mantine-color-gray-2);
  }
`

export const contentArea = css`
  grid-row: 2;
  grid-column: 2;
  position: relative;
  min-height: 100%;
`

export const contentGrid = css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  position: relative;
  min-height: 100%;
`

export const gridLines = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;

  /* Solid lines for hours */
  background-image: linear-gradient(
    to bottom,
    var(--mantine-color-gray-3) 1px,
    transparent 1px
  );
  background-size: 100% var(--time-slot-height, 60px);

  /* Dotted lines for half hours */
  &::after {
    content: "";
    position: absolute;
    top: calc(var(--time-slot-height, 60px) / 2);
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(
      to bottom,
      var(--mantine-color-gray-2) 1px,
      transparent 1px
    );
    background-size: 100% var(--time-slot-height, 60px);
    mask-image: linear-gradient(
      to right,
      black 2px,
      black 2px,
      black 4px,
      transparent 4px
    );
    mask-size: 6px 100%;
    -webkit-mask-image: linear-gradient(
      to right,
      black 2px,
      black 2px,
      black 4px,
      transparent 4px
    );
    -webkit-mask-size: 6px 100%;
  }
`

export const headerArea = css`
  grid-row: 1;
  grid-column: 2;
  border-bottom: 1px solid var(--mantine-color-gray-3);
`

export const columnHeadings = css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  padding: 0.5rem;
`

export const columnHeading = css`
  text-align: center;
  font-weight: 500;
  color: var(--mantine-color-gray-7);
`

export const cornerSpacer = css`
  grid-row: 1;
  grid-column: 1;
  border-right: 1px solid var(--mantine-color-gray-3);
  border-bottom: 1px solid var(--mantine-color-gray-3);
`

export const eventContainer = css`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(var(--column-count), 1fr);
  grid-template-rows: repeat(48, 1fr); /* 24 hours * 2 (30 min slots) */
  pointer-events: none;
`

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
