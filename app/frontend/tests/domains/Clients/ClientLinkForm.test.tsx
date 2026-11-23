import { MantineProvider } from "@mantine/core"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ClientLinkForm } from "@/domains/Clients/Overview/ClientLinkForm"
import { theme } from "@/lib/theme"

const closeModal = vi.fn()

vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}))

vi.mock("@/components/Modal", () => ({
	useModalContext: () => ({
		opened: true,
		open: vi.fn(),
		close: closeModal,
		toggle: vi.fn(),
	}),
}))

vi.mock("@/components/Form", () => ({
	Form: ({
		children,
		onSuccess,
	}: {
		children: React.ReactNode
		onSuccess?: () => void
	}) => (
		<form
			onSubmit={ (event) => {
				event.preventDefault()
				onSuccess?.()
			} }
		>
			{ children }
		</form>
	),
	Submit: ({ children }: { children: React.ReactNode }) => (
		<button type="submit">{ children }</button>
	),
}))

describe("ClientLinkForm", () => {
	beforeEach(() => {
		cleanup()
		closeModal.mockReset()
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


	it("closes the modal after a successful submit", () => {
		render(
			<MantineProvider theme={ theme }>
				<ClientLinkForm
					action="/clients/sandee/links"
					method="post"
					initialData={ { link: { title: "", url: "" } } }
					submitLabel="Add link"
				/>
			</MantineProvider>,
		)

		fireEvent.submit(screen.getByRole("button", { name: "Add link" }).closest("form")!)
		expect(closeModal).toHaveBeenCalledTimes(1)
	})

	it("closes the modal when cancel is clicked", () => {
		render(
			<MantineProvider theme={ theme }>
				<ClientLinkForm
					action="/clients/sandee/links"
					method="post"
					initialData={ { link: { title: "", url: "" } } }
					submitLabel="Add link"
				/>
			</MantineProvider>,
		)

		fireEvent.click(screen.getByRole("button", { name: "views.clients.show.overview.cancel_link" }))
		expect(closeModal).toHaveBeenCalledTimes(1)
	})
})

