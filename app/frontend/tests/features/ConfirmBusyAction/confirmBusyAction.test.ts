import { describe, expect, it, vi } from "vitest"

import { confirmBusyAction } from "@/features"

describe("confirmBusyAction", () => {
	it("keeps the modal open and shows loading while the action runs", async () => {
		const modalId = "confirm-1"
		const updateModal = vi.fn()
		const closeModal = vi.fn()
		let onConfirm: (() => void) | undefined
		const openConfirmModal = vi.fn((options: { onConfirm?: () => void, closeOnConfirm?: boolean }) => {
			onConfirm = options.onConfirm
			return modalId
		})
		const modals = {
			openConfirmModal,
			updateModal,
			closeModal,
		}
		let resolveRun: (() => void) | undefined
		const run = vi.fn(() => new Promise<void>((resolve) => {
			resolveRun = resolve
		}))

		confirmBusyAction({
			modals: modals as never,
			title: "Delete",
			children: "Confirm?",
			confirmLabel: "Delete",
			cancelLabel: "Cancel",
			run,
		})

		expect(openConfirmModal).toHaveBeenCalledWith(expect.objectContaining({
			closeOnConfirm: false,
		}))

		onConfirm?.()

		expect(updateModal).toHaveBeenCalledWith(expect.objectContaining({
			modalId,
			confirmProps: expect.objectContaining({ loading: true }),
		}))
		expect(run).toHaveBeenCalled()

		resolveRun?.()
		await vi.waitFor(() => {
			expect(closeModal).toHaveBeenCalledWith(modalId)
		})
	})
})
