import React from 'react'
import { SearchIcon } from './Icons'
import { TextInput } from './Inputs'


const SearchInput = ({ value, setValue }) => (
	<TextInput
		sx={ { width: '100%', pr: 1, pl: 2, my: 2 } }
		id="input-search-profile"
		placeholder="Search profile options"
		value={ value }
		onChange={ e => setValue(e.target.value) }
		icon={ <SearchIcon /> }
	/>
)

export default SearchInput
