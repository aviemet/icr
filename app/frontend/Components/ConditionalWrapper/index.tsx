
interface ConditionalWrapperProps {
	children: React.ReactNode
	condition: boolean
	wrapper: (children: React.ReactNode) => JSX.Element
}

const ConditionalWrapper = ({ children, condition, wrapper }: ConditionalWrapperProps) => condition ? wrapper(children) : children

export default ConditionalWrapper
