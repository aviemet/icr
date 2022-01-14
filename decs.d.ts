declare module '@material-tailwind/react/Icon' {
	const Icon: React.FC<{ name: string, size?: string, color?: string }>
	export default Icon
}

interface HeadingProps {
	color?: string
}

declare module '@material-tailwind/react/Heading1' {
	const H1: React.FC<HeadingProps>
	export default H1
}

declare module '@material-tailwind/react/Heading2' {
	const H2: React.FC<HeadingProps>
	export default H2
}
declare module '@material-tailwind/react/Heading3' {
	const H3: React.FC<HeadingProps>
	export default H3
}
declare module '@material-tailwind/react/Heading4' {
	const H4: React.FC<HeadingProps>
	export default H4
}
declare module '@material-tailwind/react/Heading5' {
	const H5: React.FC<HeadingProps>
	export default H5
}
declare module '@material-tailwind/react/Heading6' {
	const H6: React.FC<HeadingProps>
	export default H6
}
