import {
	ActionIcon,
	Paper,
	Transition,
	useMantineTheme,
	rem,
	px,
	Tooltip,
	Box,
} from "@mantine/core"
import { useClickOutside } from "@mantine/hooks"
import clsx from "clsx"
import React, { useState } from "react"

import { DoubleDownArrowIcon } from "@/components/Icons"
import { useBooleanToggle } from "@/lib/hooks"
import { useStore } from "@/lib/store"

import * as classes from "./AdvancedSearch.css"

const mantineSelectors = [
	"[data-mantine-dropdown]",
	"[data-mantine-menu]",
	"[data-mantine-popover]",
	"[data-mantine-select-dropdown]",
	".mantine-Select-dropdown",
	".mantine-Menu-dropdown",
	".mantine-Popover-dropdown",
]

const scaleY = {
	in: { opacity: 1, transform: "scaleY(1)" },
	out: { opacity: 0, transform: "scaleY(0)" },
	common: { transformOrigin: "top" },
	transitionProperty: "transform, opacity",
}

interface AdvancedSearchProps {
	children: React.ReactNode
}

export function AdvancedSearch({ children }: AdvancedSearchProps) {
	const sidebarOpen = useStore(state => state.sidebarOpen)
	const { primaryColor, other: { navbar: { width } } } = useMantineTheme()
	const navBarWidth = width[sidebarOpen ? "open" : "closed"]

	const [open, toggleOpen] = useBooleanToggle(false)
	const [searchButton, setSearchButton] = useState<HTMLButtonElement | null>(null)
	const [searchPaper, setSearchPaper] = useState<HTMLDivElement | null>(null)

	useClickOutside(
		(event) => {
			const target = event.target as HTMLElement
			if(!searchPaper) {
				toggleOpen(false)
				return
			}

			if(searchPaper.contains(target)) {
				return
			}

			if(mantineSelectors.some(selector => target.closest(selector))) {
				return
			}

			toggleOpen(false)
		},
		null,
		[searchButton, searchPaper],
	)

	return (
		<>
			<Tooltip
				withArrow
				label="Advanced Search"
				color={ primaryColor }
				position="left"
			>
				<ActionIcon
					size={ 42 }
					variant="filled"
					onClick={ () => toggleOpen() }
					ref={ setSearchButton }
					data-ignore-outside-clicks
				>
					<DoubleDownArrowIcon size={ 24 } />
				</ActionIcon>
			</Tooltip>
			<Transition
				mounted={ open }
				transition={ scaleY }
				duration={ 200 }
				timingFunction="ease"
			>
				{ (styles) => (
					<Paper
						ref={ setSearchPaper }
						shadow="md"
						p="md"
						className={ clsx(classes.paper) }
						style={ {
							...styles,
							left: rem(navBarWidth + Number(px("1rem"))),
							top: searchButton ? rem(searchButton.getBoundingClientRect().bottom + 10) : undefined,
						} }
					>
						<Box>
							{ children }
						</Box>
					</Paper>
				) }
			</Transition>
		</>
	)
}
