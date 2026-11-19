import { render, RenderOptions } from "@testing-library/react"
import React, { ReactElement } from "react"

import { Providers } from "@/layouts/Providers"

function AllTheProviders({ children }: { children: React.ReactNode }) {
	return (
		<Providers>{ children }</Providers>
	)
}

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options })

export { customRender as render }
