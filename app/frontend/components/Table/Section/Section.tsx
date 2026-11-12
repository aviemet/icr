import clsx from "clsx"
import React from "react"

import { Section as BaseSection } from "@/components"

import * as classes from "./Section.css"
import { TableSectionContextProvider } from "../Provider/TableSectionContext"

export function Section({ children }: { children: React.ReactNode }) {
	return (
		<TableSectionContextProvider value={ {} }>
			<BaseSection fullHeight className={ clsx(classes.section) }>
				{ children }
			</BaseSection>
		</TableSectionContextProvider>
	)
}
