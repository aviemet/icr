import clsx from "clsx"

import { Box } from "@/Components"

import { LayoutProps } from ".."
import * as classes from "./AuthLayout.css"

const AuthLayout = ({ children }: LayoutProps) => {
	return (
		<Box className={ clsx(classes.authLayout) }>
			{ children }
		</Box>
	)
}

export default AuthLayout
