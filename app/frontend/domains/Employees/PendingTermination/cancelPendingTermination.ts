import { router } from "@inertiajs/react"
import { type useModals } from "@mantine/modals"

import { confirmBusyAction } from "@/features"
import { Routes } from "@/lib"

type ModalsClient = ReturnType<typeof useModals>

export function cancelPendingTermination(options: {
	modals: ModalsClient
	employeeSlug: string
	employeeName: string
}) {
	confirmBusyAction({
		modals: options.modals,
		title: "Cancel pending termination",
		children: `Cancel the scheduled termination for ${options.employeeName}?`,
		confirmLabel: "Cancel termination",
		cancelLabel: "Keep scheduled",
		confirmColor: "red",
		run: () => new Promise<void>((resolve, reject) => {
			router.delete(
				Routes.pendingTerminationEmployee(options.employeeSlug),
				{
					onSuccess: () => resolve(),
					onError: () => reject(new Error("Failed to cancel pending termination")),
				},
			)
		}),
	})
}
