import { ButtonProps } from 'react-html-props'
import { colors } from './app/javascript/layouts/theme'

export { ButtonProps }

declare module 'layouts/theme' {
	export type Tcolors = keyof typeof colors
}