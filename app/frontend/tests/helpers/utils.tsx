import { render, RenderOptions } from "@testing-library/react"
import React, { FC, ReactElement } from "react"

import Providers from "@/layouts/Providers"

const AllTheProviders: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<Providers>{ children }</Providers>
	)
}

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options })

export { customRender as render }
