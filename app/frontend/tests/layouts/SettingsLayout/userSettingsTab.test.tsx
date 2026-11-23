import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { theme } from "@/lib/theme"

const mockPathname = vi.fn(() => "/settings/user")

vi.mock("@/lib/hooks", () => ({
	useLocation: () => ({
		pathname: mockPathname(),
		paths: ["settings", "user"],
	}),
	useFeatures: () => ({
		enabled: () => false,
		features: { compliance_forms: false },
	}),
}))

vi.mock("@/layouts/AppLayout", () => ({
	AppLayout: ({ children }: { children: React.ReactNode }) => <div>{ children }</div>,
}))

describe("SettingsLayout user settings tab", () => {
	beforeEach(() => {
		cleanup()
		mockPathname.mockReturnValue("/settings/user")
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

	it("right-aligns the User Settings tab", async () => {
		const { SettingsLayout } = await import("@/layouts/SettingsLayout")

		render(
			<MantineProvider theme={ theme } defaultColorScheme="light">
				<SettingsLayout>
					<div>content</div>
				</SettingsLayout>
			</MantineProvider>,
		)

		const userSettingsLink = screen.getByRole("link", { name: "User Settings" })
		expect(userSettingsLink.className).toContain("userSettingsLink")
		expect(userSettingsLink).toHaveAttribute("href", "/settings/user")
		expect(userSettingsLink).toHaveAttribute("data-active", "true")
		expect(userSettingsLink.querySelector(".controlIcon")).toBeTruthy()
		expect(screen.getByRole("link", { name: "General" }).querySelector(".controlIcon")).toBeTruthy()
	})
})
