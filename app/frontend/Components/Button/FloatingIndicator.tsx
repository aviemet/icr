import {
	Paper,
	Box,
	FloatingIndicator as MantineFloatingIndicator,
	ElementProps,
	MantineStyleProps,
	PaperProps,
	type MantineSize,
	ButtonProps,
	Button,
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
	buttonProps?: ButtonProps
}

const FloatingIndicator = ({
	options,
	radius = "sm",
	p = "xxs",
	buttonProps = {
		size: "sm",
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
			} as React.CSSProperties }
		>
			{ options.map((item, index) => (
				<Button
					key={ item.key }
					className={ classes.control }
					ref={ setControlRef(index) }
					onClick={ () => handleClick(item, index) }
					mod={ { active: active === index } }
					variant="subtle"
					{ ...buttonProps }
				>
					<Box className={ classes.controlLabel }>
						{ item.title }
					</Box>
				</Button>
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
