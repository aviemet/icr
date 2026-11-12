import { MantineProvider } from "@mantine/core"
import { cleanup, render } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { theme } from "@/lib/theme"
import Login from "@/pages/Devise/Login"

vi.mock("@/lib/hooks", () => ({
	usePageProps: () => ({
		settings: { company_name: "Test Co" },
	}),
}))

describe("Devise Login", () => {
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

	it("submits the session form as POST", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<Login />
			</MantineProvider>,
		)

		const form = document.querySelector("form")
		expect(form).not.toBeNull()
		expect(form?.getAttribute("method")?.toLowerCase()).toBe("post")
	})
})
