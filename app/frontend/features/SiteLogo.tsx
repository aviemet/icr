import { Avatar, type AvatarProps } from "@/components"

interface SiteLogoProps extends AvatarProps,
	Omit<React.ComponentPropsWithoutRef<"div">, keyof AvatarProps | "id"> {}

const SiteLogo = ({ ...props }: SiteLogoProps) => {
	return (
		<Avatar id="site-logo" { ...props } />
	)
}

export default SiteLogo
