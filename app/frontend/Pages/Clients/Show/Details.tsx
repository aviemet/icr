import React from 'react'
import { type ShowClientProps } from '.'
import { Text, Title } from '@/Components'

interface ClientDetailsProps extends ShowClientProps {}

const Details = ({ client }: ClientDetailsProps) => {
	return (
		<Text>Some kind of useful dashboard, maybe important or commonly needed information and a picture. Maybe some stats and/or charts computed from other data. Could even be just a list of useful links for the client, curated by the agency.</Text>
	)
}

export default Details
