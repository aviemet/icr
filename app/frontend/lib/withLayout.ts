import { type PagesObject } from "@/entrypoints/application"
import { LAYOUTS } from "@/layouts"

type LayoutType = keyof typeof LAYOUTS

export function withLayout<T extends object>(
	Component: PagesObject<T>["default"],
	layout: LayoutType
) {
	Component.defaultLayout = layout

	return Component
}
