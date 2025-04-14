export * as Routes from "./routes/routes"
export * as formatter from "./formatters"

export * from "./uuid"
export * from "./strings"
export * from "./collections"
export * from "./forms"
export * from "./theme"
export * from "./units"
export * from "./colors"
export * from "./withLayout"
export const polymorphicRoute = (model: string, param: string | number) => {
	// @ts-ignore
	return Routes[camelize(model)](param)
}

export * from "./mergeRefs"
export { invariant } from "./invariant"
