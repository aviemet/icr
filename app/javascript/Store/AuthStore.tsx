import React, { useContext, useReducer } from 'react'

type TAuthState = typeof initialAuthState
const initialAuthState = {
}

type TActionKeys = keyof typeof actions
export const actions = {
}

interface AuthContextProviderProps {
	children?: React.ReactNode
	auth: any
}

const reducer = (state: TAuthState, action: TActionKeys) => {
	switch(action) {
		default:
			return state
	}
}

const AuthContext = React.createContext<[TAuthState, React.Dispatch<any>]>([ initialAuthState, () => null ])

export const useAuthState = () => useContext(AuthContext)

export const AuthContextProvider = ({ children, auth }: AuthContextProviderProps) => {
	const [authState, dispatch] = useReducer(reducer, auth)

	return <AuthContext.Provider value={ [authState, dispatch] }>
		{ children }
	</AuthContext.Provider>
}
