import { get, set } from "es-toolkit/compat"
import { useCallback, useEffect, useState } from "react"

import { Button, Grid, Modal, Stack } from "@/components"
import { useFormFieldContext } from "@/components/Form"
import { MinusCircleIcon } from "@/components/Icons"
import { HiddenInput, TextInput } from "@/components/Inputs"
import { CategoriesDropdown } from "@/components/Inputs/Dropdowns"
import { useModalContext } from "@/components/Modal"
import { CollectionPanel } from "@/features"
import { flattenToPaths } from "@/lib"

import * as classes from "./ContactAttributesList.css"

interface ContactAttributesListProps {
	basePath: string
	title: string
	addLabel: string
	emptyLabel: string
	initialItems: Record<string, unknown>[]
	emptyData: Record<string, unknown>
	children: (index: number, namePrefix: string) => React.ReactNode
	draftFields: (draft: Record<string, string>, setDraft: (next: Record<string, string>) => void) => React.ReactNode
}

function getArrayAtPath(data: Record<string, unknown>, basePath: string) {
	const value = get(data, basePath)
	return Array.isArray(value) ? value : []
}

function draftToRecord(draft: Record<string, string>, emptyData: Record<string, unknown>) {
	const next: Record<string, unknown> = { ...emptyData }
	Object.entries(draft).forEach(([key, value]) => {
		next[key] = value
	})
	return next
}

function AddEntryModalBody({
	emptyData,
	draftFields,
	onAdd,
}: {
	emptyData: Record<string, unknown>
	draftFields: ContactAttributesListProps["draftFields"]
	onAdd: (item: Record<string, unknown>) => void
}) {
	const { close, opened } = useModalContext()
	const blankDraft = useCallback(() => {
		const initial: Record<string, string> = {}
		Object.keys(emptyData).forEach(key => {
			initial[key] = ""
		})
		return initial
	}, [emptyData])
	const [draft, setDraft] = useState<Record<string, string>>(blankDraft)

	useEffect(() => {
		if(opened) setDraft(blankDraft())
	}, [opened, blankDraft])

	return (
		<Stack gap="sm">
			{ draftFields(draft, setDraft) }
			<Button
				onClick={ () => {
					onAdd(draftToRecord(draft, emptyData))
					close()
				} }
			>
				Add
			</Button>
		</Stack>
	)
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
							{ existingId != null && (
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

export function AddressDraftFields(
	draft: Record<string, string>,
	setDraft: (next: Record<string, string>) => void,
) {
	return (
		<Grid>
			<Grid.Col span={ 12 }>
				<TextInput
					label="Address"
					required
					value={ draft.address ?? "" }
					onChange={ event => setDraft({ ...draft, address: event.currentTarget.value }) }
				/>
			</Grid.Col>
			<Grid.Col span={ 12 }>
				<TextInput
					label="Address line 2"
					value={ draft.address_2 ?? "" }
					onChange={ event => setDraft({ ...draft, address_2: event.currentTarget.value }) }
				/>
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput
					label="City"
					value={ draft.city ?? "" }
					onChange={ event => setDraft({ ...draft, city: event.currentTarget.value }) }
				/>
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput
					label="State / Region"
					value={ draft.region ?? "" }
					onChange={ event => setDraft({ ...draft, region: event.currentTarget.value }) }
				/>
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput
					label="Postal code"
					value={ draft.postal ?? "" }
					onChange={ event => setDraft({ ...draft, postal: event.currentTarget.value }) }
				/>
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<TextInput
					label="Label"
					value={ draft.name ?? "" }
					onChange={ event => setDraft({ ...draft, name: event.currentTarget.value }) }
				/>
			</Grid.Col>
		</Grid>
	)
}

export function PhoneDraftFields(
	draft: Record<string, string>,
	setDraft: (next: Record<string, string>) => void,
) {
	return (
		<Grid>
			<Grid.Col span={ { xs: 12, sm: 7 } }>
				<TextInput
					label="Number"
					required
					value={ draft.number ?? "" }
					onChange={ event => setDraft({ ...draft, number: event.currentTarget.value }) }
				/>
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 5 } }>
				<TextInput
					label="Extension"
					value={ draft.extension ?? "" }
					onChange={ event => setDraft({ ...draft, extension: event.currentTarget.value }) }
				/>
			</Grid.Col>
			<Grid.Col span={ 12 }>
				<TextInput
					label="Label"
					value={ draft.name ?? "" }
					onChange={ event => setDraft({ ...draft, name: event.currentTarget.value }) }
				/>
			</Grid.Col>
		</Grid>
	)
}

export function AddressFields({ namePrefix }: { namePrefix: string }) {
	return (
		<Grid>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<TextInput name={ `${namePrefix}.address` } label="Address" required />
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<TextInput name={ `${namePrefix}.address_2` } label="Address line 2" />
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput name={ `${namePrefix}.city` } label="City" />
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput name={ `${namePrefix}.region` } label="State / Region" />
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput name={ `${namePrefix}.postal` } label="Postal code" />
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<CategoriesDropdown
					name={ `${namePrefix}.category_id` }
					categoryType="Contact::Address"
					label="Category"
				/>
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<TextInput name={ `${namePrefix}.name` } label="Label" />
			</Grid.Col>
		</Grid>
	)
}

export function PhoneFields({ namePrefix }: { namePrefix: string }) {
	return (
		<Grid>
			<Grid.Col span={ { xs: 12, sm: 5 } }>
				<TextInput name={ `${namePrefix}.number` } label="Number" required />
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 3 } }>
				<TextInput name={ `${namePrefix}.extension` } label="Extension" />
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<CategoriesDropdown
					name={ `${namePrefix}.category_id` }
					categoryType="Contact::Phone"
					label="Category"
				/>
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<TextInput name={ `${namePrefix}.name` } label="Label" />
			</Grid.Col>
		</Grid>
	)
}
