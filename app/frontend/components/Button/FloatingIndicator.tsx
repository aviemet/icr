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
import { useUncontrolled } from "@mantine/hooks"
import { useRef, useState } from "react"

import * as classes from "./FloatingIndicator.css"

type FloatingIndicatorOption<T extends string = string> = {
	key: T
	title: string
	onClick?: (key: T) => void
}

interface FloatingIndicatorProps<T extends string = string> extends PaperProps, ElementProps<"div">, MantineStyleProps {
	options: FloatingIndicatorOption<T>[]
	size?: MantineSize
	buttonProps?: ButtonProps
	value?: T
	onValueChange?: (value: T) => void
	defaultValue?: T
}

const FloatingIndicator = <T extends string = string>({
	options,
	radius = "sm",
	p = "xxs",
	buttonProps = {
		size: "sm",
	},
	value,
	onValueChange,
	defaultValue,
	...props
}: FloatingIndicatorProps<T>) => {
	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
	const controlsRefs = useRef<Record<string, HTMLButtonElement | null>>({})

	const [currentValue, handleChange] = useUncontrolled<T>({
		value,
		onChange: onValueChange,
		defaultValue: defaultValue,
		finalValue: options[0]?.key,
	})

	const setControlRef = (key: T) => (node: HTMLButtonElement | null) => {
		controlsRefs.current[key] = node
	}

	const handleClick = (item: FloatingIndicatorOption<T>) => {
		handleChange(item.key)
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
			{ ...props }
		>
			{ options.map((item) => (
				<Button
					key={ item.key }
					className={ classes.control }
					ref={ setControlRef(item.key) }
					onClick={ () => handleClick(item) }
					mod={ { active: currentValue === item.key } }
					variant="subtle"
					{ ...buttonProps }
				>
					<Box className={ classes.controlLabel }>
						{ item.title }
					</Box>
				</Button>
			)) }

			{ currentValue && controlsRefs.current[currentValue] && rootRef && (
				<MantineFloatingIndicator
					target={ controlsRefs.current[currentValue] }
					parent={ rootRef }
					className={ classes.indicator }
				/>
			) }
		</Paper>
	)
}

export { FloatingIndicator }
