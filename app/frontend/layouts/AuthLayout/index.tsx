import clsx from "clsx"

import { Box } from "@/components"

import { LayoutProps } from ".."
import * as classes from "./AuthLayout.css"

export function AuthLayout({ children }: LayoutProps) {
	return (
		<Box className={ clsx(classes.authLayout) }>
			{ children }
		</Box>
	)
}
