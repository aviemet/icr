import { Box } from "@/Components"
import { LayoutProps } from ".."

import cx from "clsx"
import * as classes from "./AuthLayout.css"

const AuthLayout = ({ children }: LayoutProps) => {
	return (
		<Box className={ cx(classes.authLayout) }>
			{ children }
		</Box>
	)
}

export default AuthLayout
