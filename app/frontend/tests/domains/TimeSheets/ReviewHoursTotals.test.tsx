import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { ReviewHoursTotals } from "@/domains/TimeSheets/ReviewHoursTotals"
import { theme } from "@/lib/theme"

describe("ReviewHoursTotals", () => {
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

	it("renders one bordered row per total with right-aligned hours", () => {
		render(
			<MantineProvider theme={ theme }>
				<ReviewHoursTotals
					rows={ [
						{ key: "regular", label: "Regular", hours: 24 },
						{ key: "ot", label: "Overtime", hours: 2.5 },
						{ key: "ihss", label: "IHSS Hours", hours: 6 },
					] }
				/>
			</MantineProvider>,
		)

		expect(screen.queryByRole("heading", { name: "Total" })).not.toBeInTheDocument()
		expect(screen.getByRole("table")).toBeInTheDocument()
		expect(screen.getByText("Regular")).toBeInTheDocument()
		expect(screen.getByText("24.00 hrs")).toBeInTheDocument()
		expect(screen.getByText("Overtime")).toBeInTheDocument()
		expect(screen.getByText("2.50 hrs")).toBeInTheDocument()
		expect(screen.getByText("IHSS Hours")).toBeInTheDocument()
		expect(screen.getByText("6.00 hrs")).toBeInTheDocument()
	})
})
