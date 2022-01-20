import React from 'react'
import { CellParentContext } from './Table'

export const HeaderCell = ({ children }) => {
	return <th>{ children }</th>
}

const Head = ({ children }) => {

	return (
		<CellParentContext.Provider value={ HeaderCell }>
			<thead>{ children }</thead>
		</CellParentContext.Provider>
	)
}

export default Head
