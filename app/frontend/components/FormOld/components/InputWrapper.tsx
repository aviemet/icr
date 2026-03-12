import { ConditionalWrapper } from "@/components/ConditionalWrapper"

import { Field, type FieldProps } from "./Field"

interface InputWrapperProps extends FieldProps {
	children: React.ReactNode
	wrapped?: boolean
}

export function InputWrapper({ children, wrapped = true, ...props }: InputWrapperProps) {
	return (
		<ConditionalWrapper
			condition={ wrapped }
			wrapper={ children => (
				<Field { ...props }>
					{ children }
				</Field>
			) }
		>
			{ children }
		</ConditionalWrapper>
	)
}
