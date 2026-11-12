interface ConditionalWrapperProps {
	children: React.ReactNode
	condition: boolean
	wrapper: (children: React.ReactNode) => React.ReactNode
	elseWrapper?: (children: React.ReactNode) => React.ReactNode
}

export function ConditionalWrapper({ children, condition, wrapper, elseWrapper }: ConditionalWrapperProps) {
	if(condition) {
		return wrapper(children)
	} else if(elseWrapper) {
		return elseWrapper(children)
	}

	return <>{ children }</>
}
