import { Box, useMantineTheme } from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import clsx from "clsx"
import { useEffect } from "react"

import "@mantine/tiptap/styles.css"
import { AppShell } from "@/components"
import useStore from "@/lib/store"

import Footer from "./Footer"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import { LayoutProps } from "../index"
import * as classes from "./AppLayout.css"

const AppLayout = ({ children }: LayoutProps) => {
	const theme = useMantineTheme()
	const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
	const toggleSidebarOpen = useStore(state => state.toggleSidebarOpen)
	const sidebarOpen = useStore(state => state.sidebarOpen)
	const [mobileOpen, mobileHandlers] = useDisclosure(sidebarOpen)

	useEffect(() => {
		toggleSidebarOpen(!isMobile)
	}, [isMobile, toggleSidebarOpen])

	useEffect(() => {
		if(sidebarOpen) {
			mobileHandlers.open()
		} else if(!sidebarOpen) {
			mobileHandlers.close()
		}
	}, [sidebarOpen, mobileHandlers])

	return (
		<AppShell
			layout="alt"
			header={ { height: { base: theme.other.header.height }, collapsed: !isMobile } }
			navbar={ {
				width: { sm: sidebarOpen ? theme.other.navbar.width.open : theme.other.navbar.width.closed },
				collapsed: {
					mobile: !mobileOpen,
				},
				breakpoint: "sm",
			} }
			footer={ { height: theme.other.footer.height } }
		>
			<Topbar />
			<Sidebar />
			<Footer />
			<AppShell.Main className={ clsx(classes.main) }>
				<div id="above-content-portal"></div>
				<Box className={ clsx(classes.wrapper) }>
					{ children }
				</Box>
			</AppShell.Main>
		</AppShell>
	)
}

export default AppLayout
