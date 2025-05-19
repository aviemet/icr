import { MantineProvider, createTheme, type CSSVariablesResolver } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import { ContextMenuProvider } from "mantine-contextmenu"
import { useMemo } from "react"

import { Flash } from "@/components"
import { toKebabCase } from "@/lib"
import { useInit } from "@/lib/hooks"
import useStore from "@/lib/store"
import { theme as themeObject, vars } from "@/lib/theme"

import "./reset.css"
import "@mantine/core/styles.css"
import "@mantine/tiptap/styles.css"
import "@mantine/dates/styles.css"
import "@mantine/notifications/styles.css"
import "mantine-contextmenu/styles.layer.css"
import "./global.css"

const UiFrameworkProvider = ({ children }: { children: React.ReactNode }) => {
	/**
	 * Primary color customization
	 */
	const { primaryColor } = useStore()

	const theme = useMemo(() => createTheme({ ...themeObject, primaryColor }), [primaryColor])

	const cssVariablesResolver = useMemo((): CSSVariablesResolver => {
		return (resolverTheme) => {
			const variables: Record<string, string> = {}
			const dark: Record<string, string> = {}
			const light: Record<string, string> = {}

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
			<ContextMenuProvider>
				<ModalsProvider labels={ { confirm: "Submit", cancel: "Cancel" } }>
					<Notifications />
					<Flash />
					{ children }
				</ModalsProvider>
			</ContextMenuProvider>
		</MantineProvider>
	)
}

export default UiFrameworkProvider
