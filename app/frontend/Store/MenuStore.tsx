import React, { useContext, useReducer } from 'react'

type TMenuState = typeof initialMenuState
const initialMenuState = {
	sideMenuOpen: true
}

type TActionKeys = keyof typeof actions
export const actions = {
	TOGGLE_SIDE_MENU: 'TOGGLE_SIDE_MENU',
	OPEN_SIDE_MENU: 'OPEN_SIDE_MENU',
	CLOSE_SIDE_MENU: 'CLOSE_SIDE_MENU'
}

const reducer = (state: TMenuState, action: TActionKeys) => {
	switch(action) {
		case actions.TOGGLE_SIDE_MENU:
			return { ...state, sideMenuOpen: !state.sideMenuOpen }
		case actions.OPEN_SIDE_MENU:
			return { ...state, sideMenuOpen: true }
		case actions.CLOSE_SIDE_MENU:
			return { ...state, sideMenuOpen: false }
		default:
			return state
	}
}

const MenuContext = React.createContext<[TMenuState, React.Dispatch<any>]>([ initialMenuState, () => null ])

export const useMenuState = () => useContext(MenuContext)

export const MenuContextProvider: React.FC = ({ children }) => {
	const [menuState, dispatch] = useReducer(reducer, initialMenuState)

	return <MenuContext.Provider value={ [menuState, dispatch] }>
		{ children }
	</MenuContext.Provider>
}
