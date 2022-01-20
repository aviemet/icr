import React from 'react'
import { CellParentContext } from './Table'

export const BodyCell = ({ children }) => {
	return <td>{ children }</td>
}

const Body = ({ children }) => {
	return (
		<CellParentContext.Provider value={ BodyCell }>
			<tbody>{ children }</tbody>
		</CellParentContext.Provider>
	)
}

export default Body
