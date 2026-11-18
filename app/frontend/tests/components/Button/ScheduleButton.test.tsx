import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { ScheduleButton } from "@/components/Button"
import { theme } from "@/lib/theme"

describe("ScheduleButton", () => {
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

	it("renders a compact icon control matching other row actions", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<ScheduleButton href="/employees/ada/schedule" label="Ada" />
			</MantineProvider>,
		)

		const button = screen.getByLabelText("Schedule Ada")
		expect(button).toBeInTheDocument()
		expect(button.tagName).toBe("A")
		expect(button).toHaveAttribute("href", "/employees/ada/schedule")
	})
})
