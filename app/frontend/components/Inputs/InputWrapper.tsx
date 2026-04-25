import { Box } from "@/components"

import { ConditionalWrapper } from "../ConditionalWrapper"

interface InputWrapperProps {
	children: React.ReactNode
	wrapper?: boolean
	wrapperProps?: Record<string, any>
}

export function InputWrapper({ children, wrapper = true, wrapperProps }: InputWrapperProps) {
	return (
		<ConditionalWrapper
			wrapper={ children => <Box { ...wrapperProps }>{ children }</Box> }
			condition={ wrapper }
		>
			{ children }
		</ConditionalWrapper>
	)
}
