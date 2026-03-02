import clsx from "clsx"
import get from "lodash-es/get"
import set from "lodash-es/set"
import { useCallback, useState, type ReactNode } from "react"

import { Box, Button } from "@/components"
import { flattenToPaths } from "@/lib"

import * as classes from "./Form.css"
import { useFormFieldContext } from "./FormFieldContext"
import { MinusCircleIcon, PlusIcon } from "../Icons"

export interface DynamicFieldsProps {
	basePath: string
	children: (index: number, namePrefix: string) => ReactNode
	initialCount?: number
}

function getArrayAtPath(data: Record<string, unknown>, basePath: string) {
	const value = get(data, basePath)
	return Array.isArray(value) ? value : []
}

export function DynamicFields({ basePath, children, initialCount = 0 }: DynamicFieldsProps) {
	const { getFormData, setValue, clearPathsStartingWith } = useFormFieldContext()
	const [count, setCount] = useState(initialCount)

	const handleAdd = useCallback(() => {
		setCount(prev => prev + 1)
	}, [])

	const handleRemove = useCallback(
		(removeIndex: number) => {
			const data = getFormData()
			const arr = getArrayAtPath(data, basePath)
			const newArr = [...arr]
			newArr.splice(removeIndex, 1)
			set(data, basePath, newArr)
			clearPathsStartingWith(basePath)
			const pathEntries = flattenToPaths({ [basePath]: newArr })
			pathEntries.forEach(([path, val]) => setValue(path, val))
			setCount(prev => Math.max(0, prev - 1))
		},
		[basePath, getFormData, setValue, clearPathsStartingWith]
	)

	return (
		<>
			{ Array.from({ length: count }, (_, index) => (
				<Box key={ index } className={ clsx(classes.dynamicFieldsRow) }>

					<Box className={ clsx(classes.dynamicFieldsContent) }>
						{ children(index, `${basePath}.${index}`) }
					</Box>

					<Button
						onClick={ () => handleRemove(index) }
						aria-label={ `Remove item ${index + 1}` }
					>
						<MinusCircleIcon />
					</Button>

				</Box>
			)) }
			<Button onClick={ handleAdd } aria-label="Add item">
				<PlusIcon />
			</Button>
		</>
	)
}
