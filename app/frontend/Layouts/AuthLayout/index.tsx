import { Box, Center, Flex, Paper } from '@/Components'
import { LayoutProps } from '..'

import cx from 'clsx'
import * as classes from './AuthLayout.css'

const AuthLayout = ({ children }: LayoutProps) => {
	return (
		<Flex className={ cx(classes.authLayout) }>
			<Center p="lg" id="auth-layout-left">
				<Paper shadow="lg" radius="lg" p="xl" withBorder>
					{ children }
				</Paper>
			</Center>

			<Box id="auth-layout-right">
			</Box>
		</Flex>
	)
}

export default AuthLayout
