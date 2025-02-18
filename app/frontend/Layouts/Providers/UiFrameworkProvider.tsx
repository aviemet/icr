import { useMemo } from "react"
import { MantineProvider, createTheme, type CSSVariablesResolver } from "@mantine/core"
import { type CSSVariables } from "@mantine/core/lib/core/MantineProvider/convert-css-variables/css-variables-object-to-string"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import { theme as themeObject, vars } from "@/lib/theme"
import { toKebabCase } from "@/lib"
import useStore from "@/lib/store"
import { Flash } from "@/Components"
import { useInit } from "@/lib/hooks"

const UiFrameworkProvider = ({ children }: { children: React.ReactNode }) => {
	/**
	 * Primary color customization
	 */
	const { primaryColor } = useStore()

	const theme = useMemo(() => createTheme({ ...themeObject, primaryColor }), [primaryColor])

	const cssVariablesResolver = useMemo((): CSSVariablesResolver => {
		return (resolverTheme) => {
			const variables: CSSVariables = {}
			const dark: CSSVariables = {}
			const light: CSSVariables = {}

			Object.entries(vars.colors[primaryColor]).forEach(([key, val]) => {
				if(key.match(/[0-9]/)) {
					variables[`--mantine-color-primary-${toKebabCase(key)}`] = val
				} else {
					dark[`--mantine-color-primary-${toKebabCase(key)}`] = val
					light[`--mantine-color-primary-${toKebabCase(key)}`] = val
				}
			})

			return {
				variables,
				dark,
				light,
			}
		}
	}, [primaryColor])

	useInit(() => {
		if(import.meta.env.MODE === "development") {
			console.log({ theme })
			console.log({ vars })
		}
	})

	return (
		<MantineProvider
			theme={ theme }
			defaultColorScheme="dark"
			cssVariablesResolver={ cssVariablesResolver }
		>
			<ModalsProvider labels={ { confirm: "Submit", cancel: "Cancel" } }>
				<Notifications />
				<Flash />
				{ children }
			</ModalsProvider>
		</MantineProvider>
	)
}

export default UiFrameworkProvider
