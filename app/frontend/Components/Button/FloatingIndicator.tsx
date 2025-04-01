import { FloatingIndicator as MantineFloatingIndicator, UnstyledButton } from "@mantine/core"
import { useState } from "react"

import * as classes from "./FloatingIndicator.css"

type FloatingIndicatorOption = {
	key: string
	title: string
	onClick: (key: string) => void
}

interface FloatingIndicatorProps {
	options: FloatingIndicatorOption[]
}

const FloatingIndicator = ({ options }: FloatingIndicatorProps) => {
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
		<div className={ classes.root } ref={ setRootRef }>
			{ options.map((item, index) => (
				<UnstyledButton
					key={ item.key }
					className={ classes.control }
					ref={ setControlRef(index) }
					onClick={ () => handleClick(item, index) }
					mod={ { active: active === index } }
				>
					<span className={ classes.controlLabel }>{ item.title }</span>
				</UnstyledButton>
			)) }

			<MantineFloatingIndicator
				target={ controlsRefs[active] }
				parent={ rootRef }
				className={ classes.indicator }
			/>
		</div>
	)
}

export { FloatingIndicator }
