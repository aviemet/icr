import { type RequestPayload } from "@inertiajs/core"
import { router } from "@inertiajs/react"

import { Routes } from "@/lib"

export function assignCaseload(clientId: string, managerId: string) {
	return new Promise<void>((resolve, reject) => {
		let settled = false

		const succeed = () => {
			if(settled) return
			settled = true
			resolve()
		}

		const fail = () => {
			if(settled) return
			settled = true
			reject(new Error("assign failed"))
		}

		router.post(Routes.caseloads(), {
			clients_manager: {
				client_id: clientId,
				manager_id: managerId,
			},
		}, {
			preserveScroll: true,
			onSuccess: succeed,
			onError: fail,
			onCancel: succeed,
		})
	})
}

export function unassignCaseload(assignmentId: string) {
	return patchCaseload(assignmentId, {}, "unassign failed")
}

export function reassignCaseload(assignmentId: string, managerId: string) {
	return patchCaseload(assignmentId, {
		clients_manager: {
			manager_id: managerId,
		},
	}, "reassign failed")
}

function patchCaseload(
	assignmentId: string,
	data: RequestPayload,
	errorMessage: string,
) {
	return new Promise<void>((resolve, reject) => {
		let settled = false

		const succeed = () => {
			if(settled) return
			settled = true
			resolve()
		}

		const fail = () => {
			if(settled) return
			settled = true
			reject(new Error(errorMessage))
		}

		router.patch(Routes.caseload(assignmentId), data, {
			preserveScroll: true,
			onSuccess: succeed,
			onError: fail,
			onCancel: succeed,
		})
	})
}
