import { type useModals } from "@mantine/modals"
import { type ReactNode } from "react"

type ModalsClient = ReturnType<typeof useModals>

interface ConfirmBusyActionOptions {
	modals: ModalsClient
	title: string
	children: ReactNode
	confirmLabel: string
	cancelLabel: string
	confirmColor?: string
	run: () => Promise<void>
}

export function confirmBusyAction({
	modals,
	title,
	children,
	confirmLabel,
	cancelLabel,
	confirmColor = "red",
	run,
}: ConfirmBusyActionOptions) {
	let modalId = ""

	modalId = modals.openConfirmModal({
		title,
		children,
		closeOnConfirm: false,
		labels: {
			confirm: confirmLabel,
			cancel: cancelLabel,
		},
		confirmProps: { color: confirmColor },
		onConfirm: () => {
			modals.updateModal({
				modalId,
				confirmProps: { color: confirmColor, loading: true },
				cancelProps: { disabled: true },
			})

			void run()
				.then(() => {
					modals.closeModal(modalId)
				})
				.catch(() => {
					modals.updateModal({
						modalId,
						confirmProps: { color: confirmColor, loading: false },
						cancelProps: { disabled: false },
					})
				})
		},
	})

	return modalId
}
