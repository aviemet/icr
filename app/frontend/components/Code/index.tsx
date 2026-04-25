import { Code as MantineCode, type CodeProps as MantineCodeProps } from "@mantine/core"
import clsx from "clsx"

import * as classes from "./Code.css"

interface CodeProps extends MantineCodeProps {
	wrap?: boolean
}

export function Code({ wrap = false, className, ...props }: CodeProps) {
	return (
		<MantineCode
			className={ clsx([classes.code, { no_wrap: wrap }, className]) }
			{ ...props }
		/>
	)
}
