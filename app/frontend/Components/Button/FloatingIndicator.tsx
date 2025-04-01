import {
	Paper,
	Box,
	FloatingIndicator as MantineFloatingIndicator,
	UnstyledButton,
	ElementProps,
	MantineStyleProps,
	PaperProps,
	type MantineSize,
	ButtonProps,
} from "@mantine/core"
import { useState } from "react"

import * as classes from "./FloatingIndicator.css"

type FloatingIndicatorOption = {
	key: string
	title: string
	onClick: (key: string) => void
}

interface FloatingIndicatorProps extends PaperProps, ElementProps<"div">, MantineStyleProps {
	options: FloatingIndicatorOption[]
	size?: MantineSize
	indicatorProps: ButtonProps
}

const FloatingIndicator = ({
	options,
	radius = "sm",
	size = "sm",
	p = "xxs",
	indicatorProps = {
		p: "sm",
	},
	...props
}: FloatingIndicatorProps) => {
	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({})
	const [active, setActive] = useState(0)

	const setControlRef = (index: number) => (node: HTMLButtonElement) => {
		controlsRefs[index] = node
		setControlsRefs(controlsRefs)
	}

	const handleClick = (item: FloatingIndicatorOption, index: number) => {
		setActive(index)
		item.onClick?.(item.key)
	}

	return (
		<Paper
			className={ classes.root }
			ref={ setRootRef }
			radius={ radius }
			p={ p }
			style={ {
				"--floating-indicator-radius": `var(--mantine-radius-${radius})`,
				"--floating-indicator-padding": `var(--mantine-spacing-${p})`,
				"--floating-indicator-indicator-padding": `var(--mantine-spacing-${indicatorProps.p})`,
			} as React.CSSProperties }
			{ ...props }
		>
			{ options.map((item, index) => (
				<UnstyledButton
					key={ item.key }
					className={ classes.control }
					ref={ setControlRef(index) }
					onClick={ () => handleClick(item, index) }
					mod={ { active: active === index } }
					size={ size }
				>
					<Box className={ classes.controlLabel }>
						{ item.title }
					</Box>
				</UnstyledButton>
			)) }

			<MantineFloatingIndicator
				target={ controlsRefs[active] }
				parent={ rootRef }
				className={ classes.indicator }
			/>
		</Paper>
	)
}

export { FloatingIndicator }
