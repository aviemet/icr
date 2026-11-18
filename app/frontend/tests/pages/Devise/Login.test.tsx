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

	it("allows password managers to autofill email and password", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<Login />
			</MantineProvider>,
		)

		const emailInput = document.querySelector('input[name="user.email"]')
		expect(emailInput).not.toBeNull()
		expect(emailInput?.getAttribute("type")).toBe("email")
		expect(emailInput?.getAttribute("autocomplete")).toBe("username")
		expect(emailInput?.hasAttribute("data-1p-ignore")).toBe(false)
		expect(emailInput?.hasAttribute("data-lpignore")).toBe(false)

		const passwordInput = document.querySelector('input[name="user.password"]')
		expect(passwordInput).not.toBeNull()
		expect(passwordInput?.getAttribute("autocomplete")).toBe("current-password")
	})
})
