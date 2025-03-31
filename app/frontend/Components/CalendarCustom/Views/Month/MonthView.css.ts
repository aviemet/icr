import { css } from "@linaria/core"

import { vars } from "@/lib"

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
	margin-bottom: 0px;
  align-items: stretch;
  display: flex;
  flex: none;
  margin-bottom: -8px;
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
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;

  &.content {  
    margin-top: 30px;
    flex: 1 1 0%;
  }
`

export const dateCellBackground = css`
  border-right: ${ vars.colors.dark[2] } 1px solid;
  flex: 1 1 0%;
`

export const dateCellHeading = css`
  font-size: 14px;
  line-height: 30px;
  color: ${ vars.colors.dark[2] };
  text-align: center;
  background: transparent;
  flex: 1 1 0%;
`

export const dateCellContent = css`
  display: flex;
  position: relative;
  flex: 1 1 0%;
`
