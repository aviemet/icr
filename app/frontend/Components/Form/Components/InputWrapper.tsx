import ConditionalWrapper from "@/Components/ConditionalWrapper"
import Field, { type FieldProps } from "./Field"


interface InputWrapperProps extends FieldProps{
	children: React.ReactNode
	wrapped?: boolean
}

const InputWrapper = ({ children, wrapped = true, ...props }: InputWrapperProps) => {
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

export default InputWrapper
