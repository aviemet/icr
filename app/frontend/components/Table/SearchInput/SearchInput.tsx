import { type VisitOptions } from "@inertiajs/core"
import { router } from "@inertiajs/react"
import { ActionIcon, Box } from "@mantine/core"
import { useSessionStorage } from "@mantine/hooks"
import { debounce } from "es-toolkit"
import React, { useMemo, useEffect, useCallback } from "react"

import { SearchIcon, CrossIcon } from "@/components/Icons"
import { TextInput } from "@/components/Inputs"
import { useInit, useLocation } from "@/lib/hooks"

import { useTableContext } from "../Provider"
import { ColumnPicker } from "./ColumnPicker"
import * as classes from "./SearchInput.css"

interface SearchInputProps {
	value?: string
	onChange?: (value: string) => void
	onSearch?: (value: string) => void
	model?: string
	debounceMs?: number
}

export function SearchInput({
	value: valueProp,
	onChange: onChangeProp,
	onSearch: onSearchProp,
	model: modelProp,
	debounceMs = 500,
}: SearchInputProps) {
	const context = useTableContext(false)
	const model = modelProp ?? context?.model
	const setSearchingFromContext = context?.setSearching
	const handleSetSearching = useCallback((searching: boolean) => {
		setSearchingFromContext?.(searching)
	}, [setSearchingFromContext])

	const location = useLocation()
	const [internalValue, setInternalValue] = useSessionStorage({
		key: `${model ?? "standard"}-query`,
		defaultValue: location.params.get("search") || "",
		getInitialValueInEffect: false,
	})

	const isControlled = valueProp !== undefined
	const searchValue = isControlled ? valueProp : internalValue
	const setSearchValue = isControlled ? onChangeProp : setInternalValue

	useInit(() => {
		if(isControlled) return

		const urlSearchString = location.params.get("search")

		if(urlSearchString) {
			setInternalValue(urlSearchString)
			return
		}

		if(model && internalValue) {
			handleSetSearching?.(true)
			setInternalValue(internalValue)
		}
	})

	const debouncedSearch = useMemo(
		() => {
			if(onSearchProp) {
				return debounce((value: string) => {
					onSearchProp(value)
				}, debounceMs)
			}

			if(!model || !handleSetSearching) return null

			return debounce((path: string) => {
				const options: VisitOptions = {
					replace: true,
					preserveScroll: true,
					preserveState: true,
					onStart: () => {
						handleSetSearching(true)
					},
					onSuccess: () => {
						handleSetSearching(false)
					},
				}
				if(model) {
					options.only = [model, "pagination"]
				}

				router.get(path, {}, options)
			}, debounceMs)
		},
		[model, handleSetSearching, onSearchProp, debounceMs]
	)

	useEffect(() => {
		if(onSearchProp) {
			debouncedSearch?.(searchValue ?? "")
			return
		}

		if(!debouncedSearch || isControlled) return

		const url = new URL(window.location.href)

		if(
			url.searchParams.get("search") === searchValue ||
			(url.searchParams.get("search") === null && searchValue === "")
		) return

		if(searchValue === "") {
			url.searchParams.delete("search")
		} else {
			url.searchParams.set("search", searchValue ?? "")
			url.searchParams.delete("page")
		}

		debouncedSearch(url.toString())
	}, [debouncedSearch, searchValue, onSearchProp, isControlled])

	return (
		<Box className={ classes.searchWrapper }>
			<TextInput
				name="search"
				id="search"
				size="sm"
				value={ searchValue ?? "" }
				onChange={ e => setSearchValue?.(e.target.value) }
				rightSection={ searchValue !== "" && <ActionIcon size={ 28 } variant="transparent" onClick={ () => setSearchValue?.("") }>
					<CrossIcon color="grey" />
				</ActionIcon> }
				leftSection={ <SearchIcon size={ 18 } /> }
				leftSectionPointerEvents="none"
				className={ classes.searchInput }
				wrapper={ false }
				aria-label="Search"
			/>
			<ColumnPicker />
		</Box>
	)
}

SearchInput.displayName = "Table.SearchInput"
