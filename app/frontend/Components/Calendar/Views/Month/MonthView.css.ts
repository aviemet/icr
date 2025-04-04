import { css } from "@linaria/core"

import { borderColor } from "../../Calendar.css"
import { event } from "./components/Event/Event.css"

import { rem, vars } from "@/lib"

const headingHeight = rem(25)
export const eventHeight = rem(22)

export const monthView = css`
	position: relative;
	display: flex;  
	flex-direction: column;
	flex: 1 1 auto;
	min-height: 0;
	margin: 0;
`

export const daysHeading = css`
	width: 100%;
	margin: 0;
	align-items: stretch;
	display: flex;
	flex: none;
`

export const daysContainer = css`
	margin: 0;
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	min-height: 0;
`

export const row = css`
	position: relative;
	display: flex;
	flex: 1 1 0%;
	pointer-events: none;
	border-top-color: ${ borderColor };
	border-top-width: 1px;
	border-top-style: solid;
	padding-bottom: ${ vars.spacing.xs };
`

export const columnHeading = css`
  flex: 1 1 0%;
  text-align: center;
  text-transform: uppercase;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: ${ vars.spacing.xxs };

  border-right-color: ${ borderColor };
  border-right-width: 1px;
  border-right-style: solid;

  &:last-child {
    border-right: none;
  }
`

export const rowLayerContainer = css`
	position: relative;
	display: flex;
	flex: 1;
	pointer-events: none;
`

export const backgroundLayer = css`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`

export const headingLayer = css`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`

export const contentLayer = css`
  position: relative;
  flex: 1;
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

  border-right-color: ${ borderColor };
  border-right-width: 1px;
  border-right-style: solid;

  &:last-child {
    border-right: none;
  }
  
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

export const dateCellFooter = css`
  font-size: 12px;
  text-align: right;
  padding: 0 ${ vars.spacing.xxs };
  background: transparent;
  flex: 1 1 0%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

export const footerLayer = css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  pointer-events: none;
  height: ${ vars.spacing.md };
`
