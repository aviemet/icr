import { Box, useMantineTheme } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useEffect } from "react"

import { AppShell } from "@/Components"
import useStore from "@/lib/store"

import Footer from "./Footer"
import Sidebar from "./Sidebar"
// import Topbar from './Topbar'


import { LayoutProps } from "../index"

import "@mantine/tiptap/styles.css"
import clsx from "clsx"

import * as classes from "./AppLayout.css"

const AppLayout = ({ children }: LayoutProps) => {
	const theme = useMantineTheme()
	const sidebarOpen = useStore(state => state.sidebarOpen)
	const [mobileOpen, mobileHandlers] = useDisclosure(sidebarOpen)

	useEffect(() => {
		if(sidebarOpen) {
			mobileHandlers.open()
		} else if(!sidebarOpen) {
			mobileHandlers.close()
		}
	}, [sidebarOpen, mobileHandlers])

	return (
		<AppShell
			// header={ { height: theme.other.header.height } }
			layout="alt"
			navbar={ {
				width: { sm: sidebarOpen ? theme.other.navbar.width.open : theme.other.navbar.width.closed },
				collapsed: {
					mobile: !mobileOpen,
				},
				breakpoint: "sm",
			} }

			footer={ { height: theme.other.footer.height } }
		>
			{ /* <Topbar /> */ }
			<Sidebar />
			<Footer />
			<AppShell.Main className={ clsx(classes.main) }>
				<div id="above-content-portal"></div>
				<Box className={ clsx(classes.wrapper) } p="xs">
					{ children }
				</Box>
			</AppShell.Main>
		</AppShell>
	)
}

export default AppLayout
