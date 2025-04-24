import clsx from "clsx"

import Link, { LinkProps } from "../Link"

interface TabLinkProps extends LinkProps {
	position?: undefined | "right"
}

const TabLink = ({ position, className, ...props }: TabLinkProps) => {
	return (
		<Link { ...props } className={ clsx(className, position) } />
	)
}

export default TabLink
