import React from 'react'
import { Section } from '@/Components'
import useTableStyles from './useTableStyles'

const TableSection = ({ children }: { children: React.ReactNode }) => {
	const { classes } = useTableStyles()

	return (
		<Section fullHeight={ true } className={ classes.section }>
			{ children }
		</Section>
	)
}

export default TableSection
