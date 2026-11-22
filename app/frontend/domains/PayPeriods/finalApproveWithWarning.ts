import { router } from "@inertiajs/react"
import { type useModals } from "@mantine/modals"
import { type ReactNode } from "react"

import { confirmBusyAction } from "@/features/ConfirmBusyAction/confirmBusyAction"
import { Routes } from "@/lib"

interface UnreviewedShiftRow {
	id: string
	starts_at?: string
	client_names: string[]
}

interface FinalApproveWithWarningOptions {
	modals: ReturnType<typeof useModals>
	timesheetId: string
	unreviewedShifts: UnreviewedShiftRow[]
	title: string
	confirmLabel: string
	cancelLabel: string
	buildBody: (shifts: UnreviewedShiftRow[]) => ReactNode
}

export function finalApproveWithWarning({
	modals,
	timesheetId,
	unreviewedShifts,
	title,
	confirmLabel,
	cancelLabel,
	buildBody,
}: FinalApproveWithWarningOptions) {
	const postApprove = () => router.post(Routes.approveTimesheet(timesheetId))

	if(unreviewedShifts.length === 0) {
		postApprove()
		return
	}

	confirmBusyAction({
		modals,
		title,
		children: buildBody(unreviewedShifts),
		confirmLabel,
		cancelLabel,
		confirmColor: "blue",
		run: async () => {
			postApprove()
		},
	})
}
