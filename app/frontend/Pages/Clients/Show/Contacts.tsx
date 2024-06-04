import React from 'react'
import { type ShowClientProps } from '.'

interface ClientContactsProps extends ShowClientProps {}

const Contacts = ({ client }: ClientContactsProps) => {
	return (
		<div>Contacts</div>
	)
}

export default Contacts
