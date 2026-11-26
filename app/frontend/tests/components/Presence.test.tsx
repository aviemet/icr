import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { Presence } from "@/components/Presence"
import { theme } from "@/lib/theme"

function renderPresence(children: React.ReactNode, fallback?: React.ReactNode) {
	return render(
		<MantineProvider theme={ theme }>
			<Presence fallback={ fallback }>{ children }</Presence>
		</MantineProvider>,
	)
}

describe("Presence", () => {
	beforeEach(() => {
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: (query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: () => undefined,
				removeListener: () => undefined,
				addEventListener: () => undefined,
				removeEventListener: () => undefined,
				dispatchEvent: () => false,
			}),
		})
	})

	afterEach(() => {
		cleanup()
	})

	it("renders the muted dash for blank values", () => {
		renderPresence(null)
		expect(screen.getByText("-")).toBeInTheDocument()
	})

	it("renders whitespace-only strings as blank", () => {
		renderPresence("   ")
		expect(screen.getByText("-")).toBeInTheDocument()
	})

	it("renders present strings", () => {
		renderPresence("ABC123")
		expect(screen.getByText("ABC123")).toBeInTheDocument()
	})

	it("treats zero as present", () => {
		renderPresence(0)
		expect(screen.getByText("0")).toBeInTheDocument()
	})

	it("treats false as present", () => {
		renderPresence(false)
		expect(screen.getByText("false")).toBeInTheDocument()
	})

	it("supports a custom fallback", () => {
		renderPresence(null, "n/a")
		expect(screen.getByText("n/a")).toBeInTheDocument()
	})
})
