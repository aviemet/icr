import { router } from "@inertiajs/react"

import { Routes } from "@/lib"

export function assignCaseload(clientId: string, managerId: string) {
	return new Promise<void>((resolve, reject) => {
		router.post(Routes.caseloads(), {
			clients_manager: {
				client_id: clientId,
				manager_id: managerId,
			},
		}, {
			preserveScroll: true,
			onSuccess: () => resolve(),
			onError: () => reject(new Error("assign failed")),
			onCancel: () => reject(new Error("assign cancelled")),
		})
	})
}

export function unassignCaseload(assignmentId: string) {
	return new Promise<void>((resolve, reject) => {
		router.patch(Routes.caseload(assignmentId), {}, {
			preserveScroll: true,
			onSuccess: () => resolve(),
			onError: () => reject(new Error("unassign failed")),
			onCancel: () => reject(new Error("unassign cancelled")),
		})
	})
}
