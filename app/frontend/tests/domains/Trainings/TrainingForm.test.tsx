import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { pageChrome } from "@/components/PageChrome"
import { TrainingForm } from "@/domains/Trainings/Form"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

vi.mock("@inertiajs/react", () => ({
	router: {
		visit: vi.fn(),
	},
}))

describe("TrainingForm", () => {
	beforeEach(() => {
		cleanup()
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: () => ({
				matches: false,
				addListener: () => undefined,
				removeListener: () => undefined,
				addEventListener: () => undefined,
				removeEventListener: () => undefined,
				dispatchEvent: () => false,
			}),
		})
	})

	it("renders catalog fields", () => {
		render(
			<MantineProvider theme={ theme }>
				<TrainingForm
					to="/employees/trainings"
					training={ {
						name: "Orientation",
						description: "Intro",
						estimated_minutes: 60,
						client_ids: [],
						status: "active",
					} }
				/>
			</MantineProvider>,
		)

		expect(screen.getByText("views.trainings.form.name")).toBeTruthy()
		expect(screen.getByText("views.trainings.form.description")).toBeTruthy()
		expect(screen.getByText("views.trainings.form.estimated_minutes")).toBeTruthy()
		expect(screen.getByText("views.trainings.form.client_ids")).toBeTruthy()
		expect(screen.getByText("views.trainings.form.create")).toBeTruthy()

		const detailsBand = screen.getByText("Details").closest("section")
		expect(detailsBand?.className).toContain(pageChrome.panelSurface)

		const clientsBand = screen.getByText("Clients").closest("section")
		expect(clientsBand?.className).toContain(pageChrome.panelSurface)
	})
})
