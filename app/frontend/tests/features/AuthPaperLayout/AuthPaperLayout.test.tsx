import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { AuthPaperLayout } from "@/features/AuthPaperLayout"
import { theme } from "@/lib/theme"

describe("AuthPaperLayout", () => {
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

	it("renders main content and footer without error", () => {
		expect(() => {
			render(
				<MantineProvider theme={ theme } defaultColorScheme="dark">
					<AuthPaperLayout
						bottomLinks={ [
							<a href="/a" key="a">One</a>,
							<a href="/b" key="b">Two</a>,
						] }
					>
						<p>Main content</p>
					</AuthPaperLayout>
				</MantineProvider>,
			)
		}).not.toThrow()

		expect(screen.getByText("Main content")).toBeInTheDocument()
		expect(screen.queryAllByRole("link").length).toBeGreaterThan(0)
	})
})
