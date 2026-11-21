import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import {
	BoardActionTile,
	CountChip,
	MetricLine,
	MetricValue,
} from "@/features/RecordShow"
import { theme } from "@/lib/theme"

vi.mock("@inertiajs/react", () => ({
	Link: ({ href, children, ...props }: { href: string, children?: React.ReactNode }) => (
		<a href={ href } { ...props }>{ children }</a>
	),
}))

describe("RecordShow board primitives", () => {
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

	it("renders metric line, value, chip, and action tile", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<MetricValue label="Active clients" href="/clients">12</MetricValue>
				<MetricLine label="Pending" value={ <CountChip value={ 3 } alert /> } href="/payroll" />
				<BoardActionTile href="/clients" title="View clients" hint="Open list" />
			</MantineProvider>,
		)

		expect(screen.getByRole("link", { name: /12 Active clients/i })).toHaveAttribute("href", "/clients")
		expect(screen.getByRole("link", { name: /Pending 3/i })).toHaveAttribute("href", "/payroll")
		expect(screen.getByRole("link", { name: /View clients/i })).toHaveAttribute("href", "/clients")
		expect(screen.getByText("Open list")).toBeInTheDocument()
	})
})
