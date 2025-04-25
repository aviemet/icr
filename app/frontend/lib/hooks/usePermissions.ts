import useAuth from "./useAuth"

export function usePermissions() {
	const { currentUser } = useAuth()

	const can = (action: string, resource: string) => {
		// TODO: Implement actual permission checking logic
		return true // Temporary return until we implement the actual logic
	}

	return { can }
}
