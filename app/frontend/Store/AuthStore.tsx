import React, { useContext, useReducer } from 'react'
import axios from 'axios'

const setCsrfTokenHeader = token => {
	axios.defaults.headers.common['X-CSRF-Token'] = token
}

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

	if(auth.form_authenticity_token) setCsrfTokenHeader(auth.form_authenticity_token)

	return <AuthContext.Provider value={ [authState, dispatch] }>
		{ children }
	</AuthContext.Provider>
}
