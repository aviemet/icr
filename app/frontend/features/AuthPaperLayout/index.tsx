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
			<Paper shadow="md" radius="md" withBorder className={ clsx(classes.loginPaper) }>
				<Box p="xl">
					{ children }
				</Box>

				{ bottomLinks && bottomLinks.length > 0 && (
					<Group
						justify="center"
						grow
						className={ clsx(classes.bottomLinks) }
						gap={ 0 }
					>
						{ bottomLinks }
					</Group>
				) }

			</Paper>
		</Center>
	)
}
