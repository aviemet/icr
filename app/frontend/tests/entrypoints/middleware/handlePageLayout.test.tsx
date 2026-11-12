import { describe, expect, it } from "vitest"

import { type PagesObject } from "@/entrypoints/application"
import { handlePageLayout } from "@/entrypoints/middleware/handlePageLayout"

function TestPage() {
	return <div>page</div>
}

describe("handlePageLayout", () => {
	it("returns the module default export and assigns a layout", () => {
		const resolved = handlePageLayout({ default: TestPage })

		expect(resolved).toBe(TestPage)
		expect(resolved.layout).toEqual(expect.any(Function))
	})

	it("keeps an existing layout", () => {
		function existingLayout(children: React.ReactNode) {
			return <section>{ children }</section>
		}

		function PageWithLayout() {
			return <div>page</div>
		}

		const page: PagesObject = { default: PageWithLayout }
		page.default.layout = existingLayout

		const resolved = handlePageLayout(page)

		expect(resolved.layout).toBe(existingLayout)
	})
})
