import { router } from "@inertiajs/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { assignCaseload, reassignCaseload, unassignCaseload } from "@/domains/Caseloads/caseloadMutations"

vi.mock("@inertiajs/react", () => ({
	router: {
		post: vi.fn(),
		patch: vi.fn(),
	},
}))

describe("caseloadMutations", () => {
	beforeEach(() => {
		vi.mocked(router.post).mockReset()
		vi.mocked(router.patch).mockReset()
	})

	it("resolves assign when the visit is cancelled after a redirect follow-up", async () => {
		vi.mocked(router.post).mockImplementation((_url, _data, options) => {
			options?.onCancel?.()
			return Promise.resolve() as never
		})

		await expect(assignCaseload("client-1", "manager-1")).resolves.toBeUndefined()
	})

	it("rejects assign on error", async () => {
		vi.mocked(router.post).mockImplementation((_url, _data, options) => {
			options?.onError?.({} as never)
			return Promise.resolve() as never
		})

		await expect(assignCaseload("client-1", "manager-1")).rejects.toThrow("assign failed")
	})

	it("resolves unassign when the visit is cancelled after a redirect follow-up", async () => {
		vi.mocked(router.patch).mockImplementation((_url, _data, options) => {
			options?.onCancel?.()
			return Promise.resolve() as never
		})

		await expect(unassignCaseload("assignment-1")).resolves.toBeUndefined()
	})

	it("patches reassign with the new manager id", async () => {
		vi.mocked(router.patch).mockImplementation((_url, _data, options) => {
			options?.onSuccess?.({} as never)
			return Promise.resolve() as never
		})

		await expect(reassignCaseload("assignment-1", "manager-2")).resolves.toBeUndefined()
		expect(router.patch).toHaveBeenCalledWith(
			expect.anything(),
			{ clients_manager: { manager_id: "manager-2" } },
			expect.objectContaining({ preserveScroll: true }),
		)
	})
})
