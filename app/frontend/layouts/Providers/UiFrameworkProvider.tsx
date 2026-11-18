import { generateColors } from "@mantine/colors-generator"
import { MantineProvider, createTheme, type CSSVariablesResolver, type MantineColorsTuple } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import { ContextMenuProvider } from "mantine-contextmenu"
import { useMemo } from "react"

import { Flash } from "@/components"
import { clampBrandColor, DEFAULT_BRAND_COLOR } from "@/lib/brandColor"
import { useInit, usePageProps } from "@/lib/hooks"
import { theme as themeObject } from "@/lib/theme"

import "./reset.css"
import "@mantine/core/styles.css"
import "@mantine/tiptap/styles.css"
import "@mantine/dates/styles.css"
import "@mantine/notifications/styles.css"
import "mantine-contextmenu/styles.layer.css"
import "@mantine/spotlight/styles.css"
import "mantine-datatable/styles.css"
import "./global.css"

const BRAND_PALETTE = "brand"

export function UiFrameworkProvider({ children }: { children: React.ReactNode }) {
	const { settings } = usePageProps()
	const brandHex = clampBrandColor(settings?.primary_color || DEFAULT_BRAND_COLOR)

	const brandColors = useMemo(
		() => generateColors(brandHex) as unknown as MantineColorsTuple,
		[brandHex],
	)

	const theme = useMemo(() => createTheme({
		...themeObject,
		colors: {
			...themeObject.colors,
			[BRAND_PALETTE]: brandColors,
		},
		primaryColor: BRAND_PALETTE,
	}), [brandColors])

	const cssVariablesResolver = useMemo((): CSSVariablesResolver => {
		return (resolverTheme) => {
			const variables: Record<string, string> = {}
			const dark: Record<string, string> = {}
			const light: Record<string, string> = {}
			const palette = resolverTheme.colors[BRAND_PALETTE]

			palette?.forEach((value, index) => {
				variables[`--mantine-color-primary-${index}`] = value
			})

			const filled = palette?.[6]
			const lightValue = palette?.[1]
			const filledHover = palette?.[7]
			const lightHover = palette?.[2]

			if(filled) {
				variables["--mantine-primary-color-filled"] = filled
				dark["--mantine-color-primary-filled"] = filled
				light["--mantine-color-primary-filled"] = filled
			}
			if(filledHover) {
				variables["--mantine-primary-color-filled-hover"] = filledHover
				dark["--mantine-color-primary-filled-hover"] = filledHover
				light["--mantine-color-primary-filled-hover"] = filledHover
			}
			if(lightValue) {
				dark["--mantine-color-primary-light"] = lightValue
				light["--mantine-color-primary-light"] = lightValue
			}
			if(lightHover) {
				dark["--mantine-color-primary-light-hover"] = lightHover
				light["--mantine-color-primary-light-hover"] = lightHover
			}

			return {
				variables,
				dark,
				light,
			}
		}
	}, [])

	useInit(() => {
		if(import.meta.env.MODE === "development") {
			// eslint-disable-next-line no-console
			console.log({ theme, brandHex })
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
