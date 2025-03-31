import { css } from "@linaria/core"

import { rem, vars } from "@/lib"

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
  border-bottom: ${ vars.colors.dark[2] } 1px solid;
  display: flex;
  flex: 1 1 0%;
  pointer-events: none;
`

export const columnHeader = css`
  border-right: ${ vars.colors.dark[2] } 1px solid;
  flex: 1 1 0%;
  text-align: center;
  text-transform: uppercase;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: ${ vars.spacing.sm };
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
`

export const dateCellBackground = css`
  border-right: ${ vars.colors.dark[2] } 1px solid;
  flex: 1 1 0%;
  pointer-events: all;
  background-color: none;
  transition: background-color 200ms linear;
  
  &:hover {
    background-color: ${ vars.colors.dark[7] };
  }
`

const headingHeight = rem(25)

export const dateCellHeading = css`
  font-size: 14px;
  color: ${ vars.colors.dark[2] };
  text-align: center;
  background: transparent;
  flex: 1 1 0%;
  height: ${ headingHeight };
`

export const dateCellContent = css`
  display: flex;
  position: relative;
  flex: 1 1 0%;
  pointer-events: none;
  margin-top: ${ headingHeight };
`

export const event = css`    
  position: absolute;
  height: 24px;
  padding-right: 12px;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  pointer-events: none;
  transition: transform .3s cubic-bezier(.4,0,.2,1),opacity .3s cubic-bezier(.4,0,.2,1);
  -webkit-font-smoothing: antialiased;
  list-style: none;
  z-index: 5;

  border: 1px solid orange;
`
