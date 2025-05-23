import { Box } from "@/components"

import ConditionalWrapper from "../ConditionalWrapper"

interface InputWrapper {
	children: React.ReactNode
	wrapper?: boolean
	wrapperProps?: Record<string, any>
}

const InputWrapper = ({ children, wrapper = true, wrapperProps }: InputWrapper) => {
	return (
		<ConditionalWrapper
			wrapper={ children => <Box { ...wrapperProps }>{ children }</Box> }
			condition={ wrapper }
		>
			{ children }
		</ConditionalWrapper>
	)
}

export default InputWrapper
