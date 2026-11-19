import { set } from "es-toolkit/compat"
import { useCallback, useState } from "react"

import { Button, Modal } from "@/components"
import { useFormFieldContext } from "@/components/Form"
import { MinusCircleIcon } from "@/components/Icons"
import { HiddenInput } from "@/components/Inputs"
import { CollectionPanel } from "@/features"
import { flattenToPaths } from "@/lib"

import { AddEntryModalBody } from "./AddEntryModalBody"
import * as classes from "./ContactAttributesList.css"
import { getArrayAtPath } from "./helpers"

interface ContactAttributeItem {
	id?: string
}

export interface ContactAttributesListProps {
	basePath: string
	title: string
	addLabel: string
	emptyLabel: string
	initialItems: ContactAttributeItem[]
	emptyData: Record<string, unknown>
	children: (index: number, namePrefix: string) => React.ReactNode
	draftFields: (draft: Record<string, string>, setDraft: (next: Record<string, string>) => void) => React.ReactNode
}

export function ContactAttributesList({
	basePath,
	title,
	addLabel,
	emptyLabel,
	initialItems,
	emptyData,
	children,
	draftFields,
}: ContactAttributesListProps) {
	const { getFormData, setValue, clearPathsStartingWith } = useFormFieldContext()
	const [count, setCount] = useState(initialItems.length)

	const syncArray = useCallback((nextArray: unknown[]) => {
		const data = getFormData()
		set(data, basePath, nextArray)
		clearPathsStartingWith(basePath)
		flattenToPaths({ [basePath]: nextArray }).forEach(([path, value]) => setValue(path, value))
		setCount(nextArray.length)
	}, [basePath, clearPathsStartingWith, getFormData, setValue])

	const handleAdd = useCallback((item: Record<string, unknown>) => {
		const current = getArrayAtPath(getFormData(), basePath)
		syncArray([...current, item])
	}, [basePath, getFormData, syncArray])

	const handleRemove = useCallback((removeIndex: number) => {
		const current = getArrayAtPath(getFormData(), basePath)
		const nextArray = [...current]
		nextArray.splice(removeIndex, 1)
		syncArray(nextArray)
	}, [basePath, getFormData, syncArray])

	return (
		<CollectionPanel
			title={ title }
			count={ count }
			emptyLabel={ emptyLabel }
			actions={ (
				<Modal
					title={ addLabel }
					trigger={ (
						<Button size="xs" variant="light">
							{ addLabel }
						</Button>
					) }
				>
					<AddEntryModalBody
						emptyData={ emptyData }
						draftFields={ draftFields }
						onAdd={ handleAdd }
					/>
				</Modal>
			) }
		>
			{ Array.from({ length: count }, (_, index) => {
				const namePrefix = `${basePath}.${index}`
				const existingId = initialItems[index]?.id

				return (
					<div key={ `${namePrefix}-${index}` } className={ classes.entry }>
						<div className={ classes.entryBody }>
							{ existingId !== undefined && (
								<HiddenInput name={ `${namePrefix}.id` } defaultValue={ String(existingId) } />
							) }
							{ children(index, namePrefix) }
						</div>
						<Button
							variant="subtle"
							color="red"
							size="xs"
							aria-label={ `Remove ${title} item ${index + 1}` }
							onClick={ () => handleRemove(index) }
						>
							<MinusCircleIcon size={ 16 } />
						</Button>
					</div>
				)
			}) }
		</CollectionPanel>
	)
}
