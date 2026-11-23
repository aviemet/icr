import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { RecordShowSubNav } from "@/features/RecordShow"
import { theme } from "@/lib/theme"

describe("RecordShowSubNav", () => {
	beforeEach(() => {
		cleanup()
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

	it("marks the active section and notifies on change", async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()

		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<RecordShowSubNav
					items={ [
						{ id: "overview", label: "Overview" },
						{ id: "medications", label: "Medications" },
						{ id: "hospital_visits", label: "Hospital Visits" },
					] }
					value="overview"
					onChange={ onChange }
				/>
			</MantineProvider>,
		)

		expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true")
		expect(screen.getByRole("tab", { name: "Medications" })).toHaveAttribute("aria-selected", "false")

		await user.click(screen.getByRole("tab", { name: "Hospital Visits" }))
		expect(onChange).toHaveBeenCalledWith("hospital_visits")
	})
})
