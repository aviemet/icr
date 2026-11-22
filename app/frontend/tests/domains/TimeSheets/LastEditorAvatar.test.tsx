import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { LastEditorAvatar } from "@/domains/TimeSheets/LastEditorAvatar"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: Record<string, string>) => {
			if(key === "views.timesheets.employee_review.edited_by") {
				return `Edited by ${options?.name ?? ""}`
			}
			if(key === "views.timesheets.employee_review.edited_by_at") {
				return `Edited by ${options?.name ?? ""} (${options?.at ?? ""})`
			}
			return key
		},
	}),
}))

describe("LastEditorAvatar", () => {
	beforeEach(() => {
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: () => ({
				matches: false,
				media: "",
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			}),
		})
	})

	afterEach(() => {
		cleanup()
	})

	it("renders initials with an edited-by label", () => {
		render(
			<MantineProvider theme={ theme }>
				<LastEditorAvatar
					editor={ {
						name: "Ada Lovelace",
						initials: "AL",
						edited_at: "2024-03-20T12:00:00Z",
					} }
				/>
			</MantineProvider>,
		)

		expect(screen.getByText("AL")).toBeInTheDocument()
		expect(screen.getByLabelText(/Edited by Ada Lovelace/)).toBeInTheDocument()
	})
})
