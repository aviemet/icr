import { router } from "@inertiajs/react"
import { useModals } from "@mantine/modals"
import { useCallback } from "react"

import { Routes } from "@/lib"

import { isOffboardingDateToday, resolveOffboardingEffectiveAt } from "./offboardingSchedule"

type OffboardEmployeePayload = {
	event: string
	inactive_at?: string
	inactive_at_time?: string
	termination_reason?: string
	eligible_for_hire?: boolean | string
	terminate_immediately?: boolean | string
}

type OffboardFormData = {
	employee: OffboardEmployeePayload
}

export function useOffboardSubmit(employeeSlug: string) {
	const modals = useModals()

	return useCallback((data: OffboardFormData) => {
		const employee = data.employee
		const date = String(employee.inactive_at ?? "")
		const time = String(employee.inactive_at_time ?? "")
		const effectiveAt = resolveOffboardingEffectiveAt(date, time)

		const putStatus = (terminateImmediately: boolean) =>
			new Promise<void>((resolve, reject) => {
				router.put(
					Routes.statusEmployee(employeeSlug),
					{
						employee: {
							...employee,
							terminate_immediately: terminateImmediately,
						},
					},
					{
						onSuccess: () => resolve(),
						onError: () => reject(new Error("Failed to update employee status")),
					},
				)
			})

		const effectiveIsFuture = effectiveAt !== null && effectiveAt.getTime() > Date.now()

		if(isOffboardingDateToday(date) && effectiveIsFuture) {
			return new Promise<void>((resolve, reject) => {
				modals.openConfirmModal({
					title: "Process today?",
					children: "Last day is today. Terminate the employee now, or schedule for the specified time?",
					labels: {
						confirm: "Terminate now",
						cancel: "Schedule instead",
					},
					confirmProps: { color: "red" },
					closeOnClickOutside: false,
					onConfirm: () => {
						void putStatus(true).then(resolve).catch(reject)
					},
					onCancel: () => {
						void putStatus(false).then(resolve).catch(reject)
					},
				})
			})
		}

		return putStatus(!effectiveIsFuture)
	}, [employeeSlug, modals])
}
