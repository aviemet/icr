import { css } from "@linaria/core"

import { rem, vars } from "@/lib"

const headingHeight = rem(25)
export const eventHeight = rem(22)

export const monthView = css`
	position: absolute;
	inset: 0;
	display: flex;  
  flex-direction: column;
`

export const daysHeading = css`
	width: 100%;
  flex: 1 1 0%;
  margin: 0;
  align-items: stretch;
  display: flex;
  flex: none;
`

export const daysContainer = css`
  margin: 0;
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
`

export const row = css`
  position: relative;
  display: flex;
  flex: 1 1 0%;
  pointer-events: none;
  border-bottom-color: light-dark(${ vars.colors.gray[5] }, ${ vars.colors.dark[2] });
  border-bottom-width: 1px;
  border-bottom-style: solid;
`

export const columnHeading = css`
  flex: 1 1 0%;
  text-align: center;
  text-transform: uppercase;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: ${ vars.spacing.sm };

  border-right-color: light-dark(${ vars.colors.gray[5] }, ${ vars.colors.dark[2] });
  border-right-width: 1px;
  border-right-style: solid;
`

export const rowLayerContainer = css`
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
`

export const backgroundLayer = css`
`

export const headingLayer = css`

`

export const contentLayer = css`
  flex: 1 1 0%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(auto-fill, calc(${ eventHeight } + 2px));
  pointer-events: none;
  grid-auto-flow: dense;
  row-gap: 2px;
  column-gap: 3px;
  margin-top: ${ headingHeight };
`

export const dateCellBackground = css`
  flex: 1 1 0%;
  pointer-events: all;
  background-color: none;
  transition: background-color 200ms linear;

  border-right-color: light-dark(${ vars.colors.gray[5] }, ${ vars.colors.dark[2] });
  border-right-width: 1px;
  border-right-style: solid;
  
  &:hover {
    background-color: light-dark(${ vars.colors.gray[2] }, ${ vars.colors.dark[7] });
  }
`

export const dateCellHeading = css`
  font-size: 14px;
  color: ${ vars.colors.dark[2] };
  text-align: center;
  background: transparent;
  flex: 1 1 0%;
  height: ${ headingHeight };
`
