import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

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

	it("renders the catalog form controls", () => {
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

		expect(screen.getByRole("textbox", { name: "views.trainings.form.name" })).toBeRequired()
		expect(screen.getByRole("textbox", { name: "views.trainings.form.estimated_minutes" })).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "views.trainings.form.create" })).toBeInTheDocument()
	})

	it("loads selected clients into the clients multiselect", async () => {
		class ResizeObserverMock {
			observe() {}
			unobserve() {}
			disconnect() {}
		}
		window.ResizeObserver = ResizeObserverMock

		render(
			<MantineProvider theme={ theme }>
				<TrainingForm
					method="put"
					to="/employees/trainings/training-1"
					training={ {
						id: "training-1",
						name: "Orientation",
						client_ids: ["client-1"],
						status: "active",
					} }
					clientOptions={ [
						{ id: "client-1", name: "Ada Client" },
						{ id: "client-2", name: "Other Client" },
					] }
				/>
			</MantineProvider>,
		)

		await waitFor(() => {
			expect(screen.getByText("Ada Client")).toBeTruthy()
		})
	})
})
