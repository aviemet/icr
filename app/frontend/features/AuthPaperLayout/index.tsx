import clsx from "clsx"

import { Box, Center, Paper, Group } from "@/components"

import * as classes from "./AuthPaperLayout.css"

export interface AuthPaperLayoutProps {
	children: React.ReactNode
	bottomLinks?: React.ReactNode[]
}

export function AuthPaperLayout({ children, bottomLinks }: AuthPaperLayoutProps) {
	return (

		<Center p="lg" className={ clsx(classes.loginWrapper) }>
			<Paper shadow="lg" radius="lg" withBorder className={ clsx(classes.loginPaper) }>
				<Box p="xl">
					{ children }
				</Box>

				{ bottomLinks && <Group
					justify="center"
					content="center"
					grow
					className={ clsx(classes.bottomLinks ) }
					gap={ 0 }
				>
					{ bottomLinks }
				</Group> }

			</Paper>
		</Center>
	)
}
