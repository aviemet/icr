import { css } from "@linaria/core"

import { eventHeight } from "../../Views/Month/MonthView.css"

import { rem, vars } from "@/lib"

const rowHeight = rem(60)
const borderColor = `light-dark(${ vars.colors.dark[6] }, ${ vars.colors.gray[3] })`
const gridColor = `light-dark(${ vars.colors.gray[3] }, ${ vars.colors.dark[4] })`

export const timeGrid = css`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto 1fr;
  height: 100%;
  overflow: hidden;
`

export const timeColumn = css`
  display: flex;
  flex-direction: column;
  grid-row: 2 / span 2;
  grid-column: 1;
  position: relative;
  z-index: 1;
  border-right: 1px solid ${ borderColor };
`

export const timeSlot = css`
  height: ${ rowHeight };
  color: light-dark(${ vars.colors.dark[7] }, ${ vars.colors.gray[4] });
  font-size: ${ vars.fontSizes.xxs };
  font-weight: 700;
  position: relative;
  text-align: right;
  padding-left: 0.5rem;

  span { 
    position: relative;
    display: inline-block;
    transform: translateY(-60%);
    padding-right: 0.5rem;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 0.25rem;
    border-top: 1px solid ${ borderColor };
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: -0.5rem;
    border-top: 1px dotted light-dark(${ vars.colors.dark[8] }, ${ vars.colors.gray[6] });
  }
`

export const cornerSpacer = css`
  grid-column: 1;
  grid-row: 1;
  border-right: 1px solid ${ borderColor };
`

export const contentArea = css`
  padding-top: 1px;
  grid-column: 2;
  grid-row: 3;
  overflow-y: auto;
  position: relative;
`

export const gridLines = css`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: 
    linear-gradient(
      to right,
      ${ gridColor } 1px,
      transparent 1px
    ),
    linear-gradient(
      to bottom,
      ${ gridColor } 1px,
      transparent 1px
    );
  background-size: 
    calc(100% / var(--column-count, 7)) 100%,
    100% ${ rowHeight };
`

export const headerArea = css`
  grid-row: 1;
  grid-column: 2;
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
  color: light-dark(${ vars.colors.dark[7] }, ${ vars.colors.gray[3] });
`

export const eventsContainer = css`
  display: grid;
  position: relative;
  grid-template-columns: repeat(var(--column-count, 7), 1fr);
  grid-template-rows: repeat(var(--rows-per-day, 48), ${ rowHeight });
`

export const timeGridEvent = css`
  width: calc(100% - rem(8));
`

export const allDaySection = css`
  grid-row: 2;
  grid-column: 2;
  border-bottom: 1px solid ${ borderColor };
  min-height: ${ rowHeight };
  max-height: calc(${ rowHeight } * 2);
  padding: 0.5rem;
  display: grid;
  grid-template-columns: repeat(var(--column-count, 7), 1fr);
  grid-template-rows: repeat(auto-fill, calc(${ eventHeight } + 2px));
  gap: 0.25rem;
  overflow-y: auto;
`

export const allDayEvent = css`
  background-color: ${ vars.colors.blue[6] };
  color: ${ vars.colors.white };
  padding: 0.25rem 0.5rem;
  border-radius: ${ vars.radius.sm };
  font-size: ${ vars.fontSizes.xs };
  margin: 0.125rem 0;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
