import React from 'react'
import { InputAdornment,OutlinedInput } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const SearchInput = ({ value, setValue }) => (
	<OutlinedInput
		sx={ { width: '100%', pr: 1, pl: 2, my: 2 } }
		id="input-search-profile"
		value={ value }
		onChange={ e => setValue(e.target.value) }
		placeholder="Search profile options"
		startAdornment={
			<InputAdornment position="start">
				<SearchIcon />
			</InputAdornment>
		}
		aria-describedby="search-helper-text"
		inputProps={ {
			'aria-label': 'weight'
		} }
	/>
)

export default SearchInput
