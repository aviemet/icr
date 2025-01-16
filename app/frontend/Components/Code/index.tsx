import { Code, type CodeProps as MantineCodeProps } from "@mantine/core"

import cx from 'clsx'
import * as classes from './Code.css'

interface CodeProps extends MantineCodeProps {
	wrap?: boolean
}

const index = ({ wrap = false, className, ...props }: CodeProps) => {
	return (
		<Code
			className={ cx([classes.code, { no_wrap: wrap }, className]) }
			{ ...props }
		/>
	)
}

export default index
