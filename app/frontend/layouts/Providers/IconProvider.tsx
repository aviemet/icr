import { IconContext, type IconContext as IconContextProps } from "react-icons"

import { withDefaults } from "@/lib"

const defaultClassName = "react-icon"
const defaultSize = "1rem"

interface IconProviderProps extends IconContextProps {
	children: React.ReactNode
}

const IconProvider = ({ children, ...props }: IconProviderProps) => {
	const value: IconContextProps = withDefaults(props, {
		className: defaultClassName,
		size: defaultSize,
	})
	return (
		<IconContext.Provider value={ value }>
			{ children }
		</IconContext.Provider>
	)
}

export default IconProvider
