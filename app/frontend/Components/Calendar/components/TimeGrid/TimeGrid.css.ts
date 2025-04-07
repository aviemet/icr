import { css } from "@linaria/core"

import { rem } from "@/lib"

const rowHeight = rem(60)

export const timeGrid = css`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
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
  height: ${ rowHeight };
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

export const cornerSpacer = css`
  grid-column: 1;
  grid-row: 1;
  border-right: 1px solid var(--mantine-color-gray-3);
  border-bottom: 1px solid var(--mantine-color-gray-3);
`

export const contentArea = css`
  grid-column: 2;
  grid-row: 2;
  overflow-y: auto;
  position: relative;
`

export const contentGrid = css`
  display: flex;
  min-height: 100%;
  border-left: 1px solid var(--mantine-color-gray-3);
`

export const gridLines = css`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(
    to bottom,
    var(--mantine-color-gray-3) 1px,
    transparent 1px
  );
  background-size: 100% ${ rowHeight };
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

export const eventsContainer = css`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(${ rowHeight }, 1fr);
`
