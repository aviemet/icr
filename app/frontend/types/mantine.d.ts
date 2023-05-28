import { type SelectProps, type InputProps } from '@mantine/core'

declare module '@mantine/core' {
	export interface MantineThemeOther {
		colorSchemeOption: (light: any, dark: any) => any
		header: {
			height: number
		}
		navbar: {
			width: {
				closed: number
				open: number
			}
		}
		footer: {
			height: number
		}
		form: {
			label: {
				width: number | string
			}
		}
		table: {
			sortButtonHeight: number | string
			sortButtonWidth: number | string
		}
		colors: {
			checkoutButtonColor: string
			checkinButtonColor: string
			replenishButtonColor: string
		}
	}

	// https://phelipetls.github.io/posts/polymorphic-components-react-typescript/

	type PropsOf<T extends React.ElementType> = React.ComponentPropsWithoutRef<T>

	type PolymorphicProps<
		T extends React.ElementType = React.ElementType,
		TProps = {}
	> = {
		as?: T
	} & TProps &
	Omit<PropsOf<T>, keyof TProps & 'as'>

	interface PolymorphicComponent<T extends React.Element> {
		as: T
	}
}
