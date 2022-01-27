import React, { useContext, useReducer, useEffect } from 'react'
import axios from 'axios'

const setCsrfTokenHeader = token => {
	axios.defaults.headers.common['X-CSRF-Token'] = token
}

type TAuthState = typeof initialAuthState
const initialAuthState = {
}

type TActions = {
	UPDATE_USER: 'UPDATE_USER'
}
export const actions: TActions = {
	UPDATE_USER: 'UPDATE_USER'
}
type TActionKeys = keyof typeof actions

interface AuthContextProviderProps {
	children?: React.ReactNode
	auth: any
}

interface IReducerActionProps {
	type: TActionKeys
	payload: any
}

const reducer = (state: TAuthState, { type, payload }: IReducerActionProps): TAuthState => {
	switch(type) {
		case actions.UPDATE_USER:
			return { ...state,  user: payload }
		default:
			return state
	}
}

const AuthContext = React.createContext<[TAuthState, React.Dispatch<any>]>([ initialAuthState, () => null ])

export const useAuthState = () => useContext(AuthContext)

export const AuthContextProvider = ({ children, auth }: AuthContextProviderProps) => {
	const [authState, dispatch] = useReducer(reducer, auth)

	useEffect(() => {
		if(auth.form_authenticity_token) setCsrfTokenHeader(auth.form_authenticity_token)
	}, [auth.form_authenticity_token])

	useEffect(() => {
		dispatch({ type: actions.UPDATE_USER, payload: auth.user })
	}, [auth.user])

	return <AuthContext.Provider value={ [authState, dispatch] }>
		{ children }
	</AuthContext.Provider>
}
