import { MantineProvider } from "@mantine/core"
import { cleanup, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TrainingShowDetails } from "@/domains/Trainings/Show"
import { theme } from "@/lib/theme"

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, options?: { count?: number, defaultValue?: string }) => {
			if(key === "views.trainings.index.minutes") return `${options?.count} min`
			return options?.defaultValue ?? key
		},
	}),
}))

vi.mock("@inertiajs/react", () => ({
	Link: ({ children, href }: { children?: React.ReactNode, href: string }) => (
		<a href={ href }>{ children }</a>
	),
}))

describe("TrainingShowDetails", () => {
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

	it("renders representative training details", () => {
		render(
			<MantineProvider theme={ theme } defaultColorScheme="dark">
				<TrainingShowDetails
					training={ {
						id: "training-1",
						name: "Orientation",
						status: "active",
						estimated_minutes: 60,
						description: "<p>Welcome <strong>team</strong></p>",
						clients_trainings: [],
						employees_trainings: [],
						created_at: new Date("2024-01-01"),
						updated_at: new Date("2024-01-01"),
					} }
				/>
			</MantineProvider>,
		)

		expect(screen.getByText("Details")).toBeInTheDocument()
		expect(screen.getByText("60 min")).toBeInTheDocument()
		expect(screen.getByText("Welcome")).toBeInTheDocument()
	})
})
