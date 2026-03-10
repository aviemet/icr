import { usePageProps } from "./usePageProps"

export function useAuth() {
	const { auth } = usePageProps()

	return {
		isLoggedIn: auth?.user !== null || auth?.user !== undefined,
		currentUser: auth?.user,
	}
}
