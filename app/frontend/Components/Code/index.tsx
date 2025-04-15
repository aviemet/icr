import { Code, type CodeProps as MantineCodeProps } from "@mantine/core"
import clsx from "clsx"

import * as classes from "./Code.css"

interface CodeProps extends MantineCodeProps {
	wrap?: boolean
}

const index = ({ wrap = false, className, ...props }: CodeProps) => {
	return (
		<Code
			className={ clsx([classes.code, { no_wrap: wrap }, className]) }
			{ ...props }
		/>
	)
}

export default index
