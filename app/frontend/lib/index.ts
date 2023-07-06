export { default as greeting } from './greeting'
import * as Routes from '../../javascript/routes'

export { Routes }

export const capitalize = (str?: string|null): string => {
	if(typeof str !== 'string') return ''
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export const camelize = (str?: string|null) => {
	if(typeof str !== 'string') return ''
	return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
}

export const polymorphicRoute = (model: string, param: string|number) => {
	// @ts-ignore
	return Routes[camelize(model)](param)
}

export const coerceArray = <T extends unknown>(arg: T | T[]) => {
	if(Array.isArray(arg)) return arg
	return [arg]
}
